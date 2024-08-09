import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { ViewOptions } from "@/@types/common";
import {
    HiOutlineDocumentReport,
    HiOutlineFilter,
    HiOutlinePlusCircle,
    HiOutlineViewBoards,
    HiOutlineViewGrid,
    HiOutlineViewList,
} from 'react-icons/hi'
import { Button, Drawer, Pagination, Select } from '@/components/ui'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { IndexGridSkeleton } from '@/views/Index/components/IndexGridSkeleton'
import { IndexListSkeleton } from '@/views/Index/components/IndexListSkeleton'
import IndexBoardSkeleton from '@/views/Index/components/IndexBoardSkeleton'
import { injectReducer } from '@/store'
import { ComponentType, FunctionComponent } from 'react'
// import reducer, {
//     indexInitialState,
//     IndexPageState,
//     setIndexInitialState,
//     setIndexQueryParam,
//     setIndexView,
//     useAppSelector,
// } from '@/store/slices/IndexPage'
import { IndexTableSkeleton } from '@/views/Index/components/IndexTableSkeleton'
import IndexGridView from '@/views/Index/components/IndexGridView'
import IndexListView from '@/views/Index/components/IndexListView'
import IndexTableView from '@/views/Index/components/IndexTableView'
import IndexUsageView from '@/views/Index/components/IndexUsageView'


import { HiOutlineTableCells } from 'react-icons/hi2'
import useResponsive from '@/utils/hooks/useResponsive'
import { TbNotes } from 'react-icons/tb'
import reducer, {
    IndexPageState,
    indexInitialState,
    setIndexInitialState,
    setIndexQueryParam,
    setIndexView,
    useAppSelector
} from "@/store/slices/IndexPage";
import { useEffect, useState } from "react";
import SelectDropdown from "@/components/custom/SelectDropdown";

type IndexPageProps = {
    indexKey: string
    addBtnLabel?: string | boolean
    addBtnLabelDropdown?: boolean
    initialState?: IndexPageState
    addBtnUrl?: string
    name?: string
    noDataMainTitle?: string
    noDataSubTitle?: string
    isSelectable?: boolean
    handleSelected?: any
    queryFn: Array<any>
    addBtn?: string
    dropdownItem?: any
    gridItemComponent?: ComponentType<any>
    listItemComponent?: ComponentType<any>
    listViewComponent?: FunctionComponent
    boardViewComponent?: FunctionComponent
    tableViewComponent?: FunctionComponent
    usageViewComponent?: ComponentType<any>
    multiButton?: any //TODO:naming convention. check for all
    multiButtonShow?: boolean
    filterComponent?: ComponentType<any>
    tableColumns?: Array<any>
    title: string
    gap: number
    loading?: boolean
    grid?: {
        std: number
        xl?: number
        lg?: number
        md?: number
        xs?: number
        sm?: number
    }
    unitsCount?: boolean
    queryParamsShow?: boolean
    displayGraph?: any
    paginationShow?: boolean
    productUsage?: boolean
    headersURL?: string
    DataURL?: string
    boardStatus?: []
}
type Option = {
    value: number
    label: string
}
const options: Option[] = [
    { value: 10, label: '10 / page' },
    { value: 18, label: '18 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const iconSize = '20px'
injectReducer('indexPage', reducer)
function IndexPage(indexPageProps: IndexPageProps) {
    const {
        isSelectable,
        addBtnLabelDropdown,
        indexKey,
        name,
        noDataMainTitle,
        noDataSubTitle,
        dropdownItem,
        queryFn,
        addBtnLabel,
        addBtnUrl = 'add',
        addBtn,
        grid = { std: 2, lg: 4, md: 3, xl: 6, xs: 2, sm: 2 },
        gap = 4,
        title,
        loading,
        initialState = indexInitialState,
        gridItemComponent: GridView,
        listItemComponent: ListItem,
        boardViewComponent: BoardView,
        tableViewComponent: TableView,
        listViewComponent: ListView,
        usageViewComponent: UsageItem,
        tableColumns,

        filterComponent: Filter,
        unitsCount,
        queryParamsShow = true,
        displayGraph,
        paginationShow = true,
        multiButtonShow,
        multiButton,
        productUsage = false,
        headersURL,
        DataURL,
        boardStatus = []


    } = indexPageProps

    const dispatch = useDispatch()

    const setGenericView = (key) => (view) => {
        dispatch(
            setIndexView({
                key: key,
                value: view,
            })
        )
    }
    const userAuthority = useAppSelector((store) => store.auth.user.authority)
    const setView = setGenericView(indexKey)
    async function parseQueryStringToObject(search: any) {
        const params = new URLSearchParams(search)
        const result: any = {}
        params.forEach((value, key) => {
            if (result[key] !== undefined) {
                // If the key already exists in the result object, convert the value to an array
                if (!Array.isArray(result[key])) {
                    result[key] = [result[key]]
                }
                result[key].push(value)
            } else {
                // If the key doesn't exist in the result object, set the value
                result[key] = value
            }
        })

        // Convert single-value arrays to non-array values
        for (const key in result) {
            if (Array.isArray(result[key]) && result[key].length === 1) {
                result[key] = result[key][0]
            }
        }
        if (result.hasOwnProperty('error')) {
            delete result['error'];
        }
        return result
    }
    const initialQueryParams = parseQueryStringToObject(location.search)
    const params = useParams()
    const queryParams = useAppSelector(
        (state) => state.indexPage?.data[indexKey]?.query
    )
    const state = {
        view: initialState.view,
        query: { ...initialState.query, ...initialQueryParams },
    }
    const view: string | undefined = useAppSelector(
        (state) => state.indexPage?.data[indexKey]?.view
    )
    const queryKey = queryParams || state.query
    // const {
    //     isPending,
    //     data: response,
    //     isError,
    //     error,
    // } = useQuery({
    //     queryKey: [indexKey, queryKey],
    //     queryFn: () => queryFn(queryKey, { params: params }),
    // })
    const setGenericQuery = (key) => (query) => {
        dispatch(
            setIndexQueryParam({
                key: key,
                value: query,
            })
        )
    }

    const setQuery = setGenericQuery(indexKey)

    const navigate = useNavigate()
    // Update the query parameters when they change
    useEffect(() => {
        if (queryParamsShow) {
            const queryString = new URLSearchParams()

            if (queryParams) {
                Object.entries(queryParams).forEach(([key, value]) => {
                    if (
                        value !== null &&
                        value !== '' &&
                        value !== false &&
                        value !== undefined
                    ) {
                        if (Array.isArray(value)) {
                            value.forEach((val) => {
                                queryString.append(key, val)
                            })
                        } else {
                            queryString.append(key, value)
                        }
                    }
                })
            }

            navigate(`?${queryString}`)
        }
    }, [queryParams])

    useEffect(() => {
        if (!queryParams) {
            dispatch(
                setIndexInitialState({
                    key: indexKey,
                    value: state,
                })
            )
        }
    }, [])
    useEffect(() => {
        if (
            queryFn?.length === 0 &&
            queryParams?.pageNumber.toString() !== '1'
        ) {
            dispatch(
                setIndexQueryParam({
                    key: indexKey,
                    value: { pageNumber: 1 },
                })
            )
        }
    }, [queryFn])

    const viewOptions: ViewOptions[] = []
    if (GridView)
        viewOptions.push({
            value: 'grid',
            label: 'Grid',
            icon: <HiOutlineViewGrid size={iconSize} />,
        })
    if (ListItem || ListView)
        viewOptions.push({
            value: 'list',
            label: 'List',
            icon: <HiOutlineViewList size={iconSize} />,
        })
    if (BoardView)
        viewOptions.push({
            value: 'board',
            label: 'Board',
            icon: <HiOutlineViewBoards size={iconSize} />,
        })
    if (tableColumns || TableView)
        viewOptions.push({
            value: 'table',
            label: 'Table',
            icon: <HiOutlineTableCells size={iconSize} />,
        })
    //Usage
    if (UsageItem)
        viewOptions.push({
            value: 'usage',
            label: 'Product Usage',
            icon: <TbNotes size={iconSize} />,
        })

    useEffect(() => {
        if (!viewOptions.some((x) => x.value == initialState.view))
            setView(viewOptions[0].value)
    }, [])

    const [isOpen, setIsOpen] = useState(false)
    const { smaller } = useResponsive()
    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if (!smaller.md) {
            setIsOpen(false)
        }

        if (smaller.sm) {
            setView('table')
        }
    }, [])

    function areObjectsEqual(obj1, obj2) {
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)

        if (keys1.length !== keys2.length) {
            return false
        }

        for (let key of keys1) {
            const value1 =
                typeof obj1[key] === 'number' || typeof obj1[key] === 'boolean'
                    ? String(obj1[key])
                    : obj1[key]
            const value2 =
                typeof obj2[key] === 'number' || typeof obj2[key] === 'boolean'
                    ? String(obj2[key])
                    : obj2[key]

            if (value1 !== value2) {
                return false
            }
        }

        return true
    }


    return (
        <>
            <div className="h-full relative">
                {
                    queryFn?.length === 0 &&
                        areObjectsEqual(queryParams, initialState.query) ? (
                        <div className="flex emptyPageBlock flex-col gap-5 justify-center items-center">
                            {noDataMainTitle && <h5 className="text-center mb-2">{noDataMainTitle}</h5>}
                            {noDataSubTitle && <h6 className="text-center">{noDataSubTitle}</h6>}
                            <div className="text-center flex flex-wrap gap-2">
                                {addBtnLabel && (
                                    <Link to={addBtnUrl}>
                                        <Button
                                            variant="solid"
                                            icon={<HiOutlinePlusCircle />}
                                            size="sm"
                                        >
                                            {addBtnLabel}
                                        </Button>
                                    </Link>
                                )}

                                {addBtnLabelDropdown && (
                                    dropdownItem(queryFn,
                                        queryParams,
                                        initialState.query)
                                )}
                                {multiButtonShow && multiButton()}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            {
                                <div className="flex items-center mb-4 gap-2 flex-wrap justify-between">
                                    <h3>{title}</h3>
                                    <div className="flex gap-3 items-center">
                                        <div>
                                            <SelectDropdown
                                                labelWithIcon={true}
                                                iconOnly={true}
                                                value={view}
                                                handleChange={(value: any) => setView(value)}
                                                options={viewOptions} defaultValue={null} />
                                        </div>
                                        {addBtnLabel && (
                                            <Link to={addBtnUrl}>
                                                <Button
                                                    variant="solid"
                                                    icon={<HiOutlinePlusCircle />}
                                                    size="sm"
                                                >
                                                    {addBtnLabel}
                                                </Button>
                                            </Link>
                                        )}
                                        {addBtnLabelDropdown && (
                                            dropdownItem(queryFn,
                                                queryParams,
                                                initialState.query)
                                        )}
                                    </div>
                                </div>
                            }

                            <div>{displayGraph}</div>

                            {Filter && (
                                <>
                                    <div className="hidden md:block">
                                        <Filter
                                            query={queryParams}
                                            setQuery={setQuery}
                                            initialState={initialState}
                                        />
                                    </div>
                                    <div className="block md:hidden print:hidden">
                                        <Button
                                            size="sm"
                                            className="block w-full md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
                                            icon={<HiOutlineFilter />}
                                            onClick={openDrawer}
                                        >
                                            Filter
                                        </Button>
                                        <Drawer
                                            title="Filter"
                                            isOpen={isOpen}
                                            drawerClass={' w-full xs:w-[350px]'}
                                            onClose={onDrawerClose}
                                            onRequestClose={onDrawerClose}
                                        >
                                            <Filter
                                                query={queryParams}
                                                setQuery={setQuery}
                                                initialState={initialState}
                                            />
                                            <div className="text-right w-full">
                                                {/* <Button
                                                size="sm"
                                                className="mr-2"
                                                onClick={onDrawerClose}
                                            >
                                                Cancel
                                            </Button> */}
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    onClick={onDrawerClose}
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </Drawer>
                                    </div>
                                </>
                            )}

                            {/* {isPending && view === 'grid' && <IndexGridSkeleton />}
                            {isPending && view === 'list' && <IndexListSkeleton />}
                            {isPending && view === 'board' && (
                                <IndexBoardSkeleton />
                            )}
                            {isPending && view === 'table' && (
                                <IndexTableSkeleton />
                            )}

                            {isPending && view === 'usage' && <IndexListSkeleton />}

                            {isError && <span>Error: {error.message}</span>} */}

                            {queryFn &&
                                viewOptions.length > 0 && (
                                    <>
                                        {view == 'board' && (
                                            <BoardView
                                                boardStatus={boardStatus}
                                                DataURL={DataURL}
                                                headersURL={headersURL}
                                                data={queryFn}
                                                query={queryParams}
                                                setQuery={setQuery}
                                            />
                                        )}
                                        {view == 'grid' && (
                                            <GridView
                                                DataURL={DataURL}
                                                headersURL={headersURL}
                                                data={queryFn}
                                                query={queryParams}
                                                setQuery={setQuery}
                                            // item={GridItem}
                                            // grid={grid}
                                            // gap={gap}
                                            // isSelectable={isSelectable}
                                            />
                                        )}
                                        {view == 'list' && ListItem && (
                                            <IndexListView
                                                data={queryFn}
                                                query={queryParams}
                                                setQuery={setQuery}
                                                item={ListItem}
                                            />
                                        )}
                                        {view == 'list' && ListView && (
                                            <ListView
                                                data={queryFn}
                                                query={queryParams}
                                                setQuery={setQuery}
                                                item={ListItem}
                                            />
                                        )}

                                        {view == 'table' && tableColumns && (
                                            <IndexTableView
                                                DataURL={DataURL}
                                                headersURL={headersURL}
                                            // data={queryFn}
                                            // query={queryParams}
                                            // setQuery={setQuery}
                                            // columns={tableColumns}
                                            // loading={loading}
                                            />
                                        )}
                                        {view == 'table' && TableView && (
                                            <TableView
                                                data={queryFn}
                                                query={queryParams}
                                                setQuery={setQuery}
                                                columns={tableColumns}
                                            />
                                        )}
                                        {view == 'usage' && UsageItem && (
                                            // <UsageView />
                                            <IndexUsageView
                                                data={queryFn}
                                                query={queryParams}
                                                setQuery={setQuery}
                                                item={UsageItem}
                                            />
                                        )}
                                    </>
                                )}
                            {/* {paginationShow && (
                                <div className="footer flex flex-auto items-center mt-2 print:hidden">
                                    <div className="flex flex-col md:flex-row items-center justify-between flex-auto gap-3">
                                        <div className="w-full md:w-auto flex flex-wrap justify-center sm:justify-start items-center md:mb-0">
                                            <Pagination
                                                total={
                                                    response?.pagination?.pages || 0
                                                }
                                                currentPage={Number(
                                                    queryParams?.pageNumber
                                                )}
                                                onChange={(page) =>
                                                    setQuery({ pageNumber: page })
                                                }
                                            />
                                            {unitsCount && (
                                                <div>
                                                    <strong className="mr-1">
                                                        {
                                                            response?.pagination
                                                                ?.rowsNumber
                                                        }
                                                    </strong>{' '}
                                                    Products Found (
                                                    <strong className="mr-1">
                                                        {
                                                            response?.pagination
                                                                ?.unitsCount
                                                        }
                                                    </strong>{' '}
                                                    RFID Tags)
                                                </div>
                                            )}
                                        </div>

                                        {response?.pagination?.rowsNumber > 10 && (
                                            <div className="w-full md:w-auto flex justify-center md:justify-end">
                                                <div style={{ minWidth: 120 }}>
                                                    <Select
                                                        size="sm"
                                                        menuPlacement="auto"
                                                        isSearchable={false}
                                                        options={options}
                                                        value={options.find(
                                                            (option) =>
                                                                option.value ===
                                                                Number(
                                                                    queryParams?.pageSize
                                                                )
                                                        )}
                                                        onChange={(selected) =>
                                                            setQuery({
                                                                pageSize:
                                                                    selected?.value,
                                                                // pageNumber: 1,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )} */}
                        </div>
                    )}
            </div>
        </>
    )
}

export default IndexPage
