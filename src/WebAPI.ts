import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { webStatusCodes } from './constants.js'
import { UnknownError } from './errors.js'
import { getErrorMessage } from './getErrorMessage.js'
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

      const errorMessage = getErrorMessage(response.data.status, response.data.error)
      throw new UnknownError(errorMessage, undefined, response.config, response.request, response)
    })
  }

  public async marketplaceServers(
    config?: AxiosRequestConfig,
  ): Promise<WebMarketplaceServersOutput> {
    const response = await this.api.post<WebMarketplaceServersOutput>('/marketplace/servers', null, config)
    return response.data
  }

  public async marketplaceOrders(
    body: WebMarketplaceOrdersBody,
    config?: AxiosRequestConfig<WebMarketplaceOrdersBody>,
  ): Promise<WebMarketplaceOrdersOutput> {
    const response = await this.api.post<WebMarketplaceOrdersOutput>('/marketplace/orders', body, config)
    return response.data
  }

  public async createOrder(
    body: WebCreateOrderBody,
    config?: AxiosRequestConfig<WebCreateOrderBody>,
  ): Promise<WebCreateOrderOutput> {
    const response = await this.api.post<WebCreateOrderOutput>('/create_order', body, config)
    return response.data
  }
}
