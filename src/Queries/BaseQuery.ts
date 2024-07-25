import BaseService from "../services/BaseService";
import { ApiResponse } from "@/@types/auth";
import { AxiosResponse } from "axios";


export abstract class BaseQuery {
  baseUrl = ' https://localhost:7128/api/'
  path = 'sdsd'


  url = (path = '') => this.path + path

  getAll = async<T>(queryParams = {}): Promise<{
    data: T,
    pagination?: {
      rowsNumber: number,
      pages: number,
      page: number

    }

  }> => {
    //console.log('executing get all', queryParams)

    const response = await BaseService.get<ApiResponse<T>>(this.url(), { params: queryParams })




    return this.processResponse(response)
  }
  get = async<T>(uid: string): Promise<T> => {
    const response = await BaseService.get<ApiResponse<T>>(this.url(uid))
    return response.data
  }
  post = async<T>(postData: any): Promise<T> => {
    const response = await BaseService.post<ApiResponse<T>>(this.url(), postData)
    return response.data
  }
  put = async<T>(uid: string, postData: any): Promise<T> => {
    const response = await BaseService.put<ApiResponse<T>>(this.url(uid), postData)
    return response.data
  }

  delete = async<T>(uid: string, data = {}): Promise<T> => {
    const response = await BaseService.delete<ApiResponse<T>>(this.url(uid), data)
    return response.data
  }

  protected processResponse = async<T>(response: AxiosResponse<ApiResponse<T>>) => {
    if (response.headers['x-total-count']) {

      return {
        data: response.data,
        pagination: {
          rowsNumber: parseInt(response.headers['x-total-count']),
          pages: parseInt(response.headers['x-total-pages']),
          page: parseInt(response.headers['x-page']),
          unitsCount: parseInt(response.headers['x-units-count'])
        }


      }
    }

    return { data: response.data }
  }


}


