import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

import { webStatusCodes } from './constants.js'
import { UnknownError } from './errors.js'
import { type WebOptions } from './types/options.js'
import { type WebOutput } from './types/output.js'
import { type WebCreateOrderBody, type WebCreateOrderOutput } from './types/webapi/createOrder.js'
import { type WebMarketplaceOrdersBody, type WebMarketplaceOrdersOutput } from './types/webapi/marketplaceOrders.js'
import { type WebMarketplaceServersOutput } from './types/webapi/marketplaceServers.js'

export class WebAPI {
  public readonly api: AxiosInstance

  public constructor(options: WebOptions) {
    const { token, axiosConfig = {} } = options

    this.api = axios.create({
      ...axiosConfig,
      baseURL: 'https://clore.ai/webapi',
    })

    this.api.interceptors.request.use((request) => {
      request.data = {
        ...request.data,
        token,
      }

      return request
    })

    this.api.interceptors.response.use((response: AxiosResponse<WebOutput>) => {
      if (response.data.status === webStatusCodes['NORMAL']) {
        return response
      }

      const statusCodeMessage = response.data.status != null ? `Status code "${response.data.status}".` : null
      const errorFieldMessage = response.data.error != null ? `Error field "${response.data.error}".` : null
      const errorMessageArray = [statusCodeMessage, errorFieldMessage].filter((message) => {
        return message != null
      })

      const errorMessage = errorMessageArray.join(' ')
      throw new UnknownError(errorMessage, undefined, response.config, response.request, response)
    })
  }

  public async marketplaceServers(): Promise<WebMarketplaceServersOutput> {
    const response = await this.api.post<WebMarketplaceServersOutput>('/marketplace/servers')
    return response.data
  }

  public async marketplaceOrders(body: WebMarketplaceOrdersBody): Promise<WebMarketplaceOrdersOutput> {
    const response = await this.api.post<WebMarketplaceOrdersOutput>('/marketplace/orders', body)
    return response.data
  }

  public async createOrder(body: WebCreateOrderBody): Promise<WebCreateOrderOutput> {
    const response = await this.api.post<WebCreateOrderOutput>('/create_order', body)
    return response.data
  }
}
