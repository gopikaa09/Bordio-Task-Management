import { Fragment, ReactElement } from 'react'

import { css } from '@emotion/react'

import Avatar from '@atlaskit/avatar'
import { Inline } from '@atlaskit/primitives'
import { Item, Status } from './type'


const customAvatarStyles = css({
  /**
   * The purpose of this is to prevent dragging the image
   */
  pointerEvents: 'none'
})

export function getField({
  item,
  property
}: {
  item: Item
  property: keyof Item
}): ReactElement {
  if (property === 'status') {
    return statusMap[item[property]]
  }
  return <Fragment>{item[property]}</Fragment>
}

const propertyMap: { [key in keyof Item]: string } = {
  id: 'Id',
  description: 'Description',
  status: 'Status',
}

export function getProperty(value: keyof Item): string {
  return propertyMap[value]
}

const statusMap: { [key in Status]: ReactElement } = {
  todo: <p>Todo</p>,
  'in-progress': <p>In Progress</p>,
  done: <p>Done</p>
}

export function getStatus(value: Status): ReactElement {
  return statusMap[value]
}