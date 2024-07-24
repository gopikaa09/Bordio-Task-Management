import BaseService from '@/services/BaseService'
import { BaseQuery } from './BaseQuery'


export class TaskListQuery extends BaseQuery {
  path = 'http://localhost:4000/taskList'
}

