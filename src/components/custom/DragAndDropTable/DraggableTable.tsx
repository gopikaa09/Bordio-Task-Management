import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { css } from '@emotion/react'
import invariant from 'tiny-invariant'

// import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop/flourish';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'

import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import { token } from '@atlaskit/tokens'

import { getItems } from './data'
import { ItemContextValue, TableContext } from './table-context'
import { TableHeader } from './table-header'

import { GlobalStyles } from './global-style'
import { Item, ItemRegistration, ReorderFunction } from './type'
import { Row } from './row'

const tableStyles = css({
  tableLayout: 'fixed',
  // We don't want to collapse borders - otherwise the border on the header
  // will disappear with position:sticky
  // https://stackoverflow.com/questions/50361698/border-style-do-not-work-with-sticky-position-element
  borderCollapse: 'separate',
  borderSpacing: 0,

  // Adding a bit more space to the first column for consistency and to give room
  // for the drop indicator and the drag handle
  'th:first-of-type, td:first-of-type': {
    paddingLeft: 40
  }
})

const tableHeaderStyles = css({
  background: token('elevation.surface', '#FFF'),
  borderBottom: '2px solid',
  position: 'sticky',
  top: 0,
  // zIndex: 2 is needed so that the sticky header will sit on top of our
  // row items, which need to have `position:relative` applied so they can render
  // the drop indicators
  // Using zIndex:2 rather than zIndex: 1 as our drop indicator uses zIndex: 1
  // and we want the header to always be on top of the drop indicator
  zIndex: 2
})

const scrollableStyles = css({
  height: '50vh',
  overflowY: 'scroll',
  overflowX: 'visible'
})

function extractIndex(data: Record<string, unknown>) {
  const { index } = data
  if (typeof index !== 'number') {
    return null
  }
  return index
}

type Operation =
  | {
    type: 'row-reorder'
    currentIndex: number
  }
  | {
    type: 'column-reorder'
    currentIndex: number
  }

const Table = () => {
  // Data
  const [items, setItems] = useState(() => getItems({ amount: 20 }))
  const [columns, setColumns] = useState<(keyof Item)[]>([
    'status',
    'description',
  ])
  const [instanceId] = useState(() => Symbol('instance-id'))

  const [lastOperation, setLastOperation] = useState<Operation | null>(null)

  const elementMapRef = useRef(new Map<number, HTMLElement>())

  useEffect(() => {
    if (lastOperation === null) {
      return
    }

    if (lastOperation.type === 'row-reorder') {
      const element = elementMapRef.current.get(lastOperation.currentIndex)
      if (element) {
        // triggerPostMoveFlash(element)
      }
      return
    }

    if (lastOperation.type === 'column-reorder') {
      const table = tableRef.current
      invariant(table)

      const column = table.querySelector<HTMLElement>(
        `col:nth-of-type(${lastOperation.currentIndex + 1})`
      )
      if (column) {
        // triggerPostMoveFlash(column)
      }
      return
    }
  }, [lastOperation])

  const reorderItem: ReorderFunction = useCallback(
    ({ startIndex, indexOfTarget, closestEdgeOfTarget = null }) => {
      const finishIndex = getReorderDestinationIndex({
        axis: 'vertical',
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget
      })

      setItems((items) => {
        return reorder({
          list: items,
          startIndex,
          finishIndex
        })
      })

      setLastOperation({
        type: 'row-reorder',
        currentIndex: finishIndex
      })
    },
    []
  )

  const reorderColumn: ReorderFunction = useCallback(
    ({ startIndex, indexOfTarget, closestEdgeOfTarget = null }) => {
      const finishIndex = getReorderDestinationIndex({
        axis: 'horizontal',
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget
      })

      setColumns((items) =>
        reorder({
          list: items,
          startIndex,
          finishIndex
        })
      )

      setLastOperation({
        type: 'column-reorder',
        currentIndex: finishIndex
      })
    },
    []
  )

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.instanceId === instanceId
      },
      onDragStart({ location, source }) {
        // Only enabling auto scrolling when scrolling rows
        // - resizing: we don't want auto scrolling
        // - column headers: we don't want to be scrolling vertically
        // if (source.data.type === 'item-row') {
        //   autoScroller.start({
        //     input: location.current.input,
        //     behavior: 'container-only'
        //   })
        // }

        // using this class to disable hover styles while dragging
        document.body.classList.add('is-dragging')
      },
      onDrag({ location }) {
        // It is safe to call `updateInput` optimistically,
        // if the `autoScroller` has not been started it will noop.
        // autoScroller.updateInput({ input: location.current.input })
      },
      onDrop({ location, source }) {
        document.body.classList.remove('is-dragging')

        // It is safe to call `stop` optimistically,
        // if the `autoScroller` has not been started it will noop.
        // autoScroller.stop()

        /**
         * Only checking the inner-most drop target.
         */
        const destination = location.current.dropTargets.at(0)
        if (!destination) {
          return
        }

        const startIndex = extractIndex(source.data)
        const indexOfTarget = extractIndex(destination.data)
        if (startIndex === null || indexOfTarget === null) {
          return
        }

        const closestEdgeOfTarget = extractClosestEdge(destination.data)

        if (source.data.type === 'item-row') {
          reorderItem({ startIndex, indexOfTarget, closestEdgeOfTarget })
          return
        }

        if (source.data.type === 'table-header') {
          reorderColumn({ startIndex, indexOfTarget, closestEdgeOfTarget })
          return
        }
      }
    })
  }, [instanceId, reorderColumn, reorderItem])

  // Elements
  const tableRef = useRef<HTMLTableElement | null>(null)
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  // Keeping track of visible items
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibleItemIndexSetRef = useRef<Set<number>>(new Set())
  const registrationsRef = useRef<Map<Element, ItemRegistration>>(new Map())

  // Making `stableItems` so that `getItemsForColumnPreview` does not need to cause
  // deep re-rendering when `items` change.
  const stableItems = useRef<Item[]>(items)
  useEffect(() => {
    stableItems.current = items
  }, [items])

  const getItemsForColumnPreview = useCallback((): {
    items: Item[]
    isMoreItems: boolean
  } => {
    // Use the first visible index if it is available, otherwise use `0`
    const firstVisibleIndex =
      Array.from(visibleItemIndexSetRef.current).sort((a, b) => a - b)[0] ?? 0

    const items = stableItems.current.slice(
      firstVisibleIndex,
      firstVisibleIndex + 10
    )
    const isMoreItems = stableItems.current.length > items.length

    return { items, isMoreItems }
  }, [])

  const register = useCallback((registration: ItemRegistration) => {
    registrationsRef.current.set(registration.element, registration)
    // The `useEffect` of children runs before parents
    // so when initially mounting the `IntersectionObserver` will not be ready yet
    observerRef.current?.observe(registration.element)

    elementMapRef.current.set(registration.index, registration.element)

    return function unregister() {
      registrationsRef.current.delete(registration.element)
      observerRef.current?.unobserve(registration.element)

      elementMapRef.current.delete(registration.index)
    }
  }, [])

  const contextValue: ItemContextValue = useMemo(() => {
    return {
      getItemsForColumnPreview,
      reorderColumn,
      reorderItem,
      register,
      instanceId
    }
  }, [
    getItemsForColumnPreview,
    reorderColumn,
    reorderItem,
    register,
    instanceId
  ])

  // Storing the height of the table in a CSS variable
  // This is used by our header resizer and drop target
  useEffect(() => {
    const table = tableRef.current
    invariant(table)
    const height = table.getBoundingClientRect().height
    table.style.setProperty('--table-height', `${height}px`)

    // be sure to recompute the table height when changes occur that an impact it's height
  }, [items])

  useEffect(() => {
    const scrollable = scrollableRef.current
    invariant(scrollable)
    console.log('setting up observer')
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const registration = registrationsRef.current.get(entry.target)
            invariant(registration)
            visibleItemIndexSetRef.current.add(registration.index)
            console.log('index visible', registration.index)
            return
          }

          if (!entry.isIntersecting) {
            const registration = registrationsRef.current.get(entry.target)
            invariant(registration)
            console.log('index not visible', registration.index)
            visibleItemIndexSetRef.current.delete(registration.index)
          }
        })
      },
      {
        // An item is only 'visible' if it would visible below the sticky header
        // rather than using '-40px' could grab the exact height of the header
        rootMargin: '-40px 0px 0px 0px',
        threshold: 0,
        root: scrollable
      }
    )

    // The `useEffect` of children runs before parents
    // so when initially mounting, there will be registrations before
    // the `IntersectionObserver` is ready
    registrationsRef.current.forEach((registration) => {
      observerRef.current?.observe(registration.element)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <Fragment>
      <GlobalStyles />
      <TableContext.Provider value={contextValue}>
        <div css={scrollableStyles} ref={scrollableRef}>
          <table css={tableStyles} ref={tableRef}>
            <colgroup>
              {columns.map((property) => (
                <col key={property} />
              ))}
            </colgroup>
            <thead css={tableHeaderStyles}>
              <tr>
                {columns.map((property, index, array) => (
                  <TableHeader
                    property={property}
                    key={property}
                    index={index}
                    amountOfHeaders={array.length}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <Row
                  key={item.id}
                  item={item}
                  index={index}
                  properties={columns}
                  amountOfRows={items.length}
                />
              ))}
            </tbody>
          </table>
        </div>
      </TableContext.Provider>
    </Fragment>
  )
}

export default Table