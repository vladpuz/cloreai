import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import type { WebConfig } from './types/config.js'
import type { WebOutput } from './types/output.js'
import type { WebCancelOrderBody, WebCancelOrderOutput } from './types/webapi/cancelOrder.js'
import type { WebCreateOrderBody, WebCreateOrderOutput } from './types/webapi/createOrder.js'
import type { WebGetSpotBody, WebGetSpotOutput } from './types/webapi/getSpot.js'
import type { WebOrdersBody } from './types/webapi/orders.js'
import type { WebServersOutput } from './types/webapi/servers.js'
import type { WebSetSpotPriceBody, WebSetSpotPriceOutput } from './types/webapi/setSpotPrice.js'

import { UnknownError } from './errors.js'
import { getErrorMessage } from './getErrorMessage.js'

export class WebAPI {
  public readonly api: AxiosInstance

  public constructor(config: WebConfig) {
    const { token, axiosConfig = {} } = config

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
      const hasError = Boolean(response.data.error)

      if (!hasError) {
        return response
      }

      const errorMessage = getErrorMessage(response.data.status, response.data.error)
      throw new UnknownError(errorMessage, undefined, response.config, response.request, response)
    })
  }

  public async servers(
    config?: AxiosRequestConfig,
  ): Promise<WebServersOutput> {
    const response = await this.api.post<WebServersOutput>('/marketplace/servers', null, config)
    return response.data
  }

  public async orders(
    body: WebOrdersBody,
    config?: AxiosRequestConfig<WebOrdersBody>,
  ): Promise<WebServersOutput> {
    const response = await this.api.post<WebServersOutput>('/marketplace/orders', body, config)
    return response.data
  }

  public async getSpot(
    body: WebGetSpotBody,
    config?: AxiosRequestConfig<WebGetSpotBody>,
  ): Promise<WebGetSpotOutput> {
    const response = await this.api.post<WebGetSpotOutput>('/marketplace/get_spot', body, config)
    return response.data
  }

  public async setSpotPrice(
    body: WebSetSpotPriceBody,
    config?: AxiosRequestConfig<WebSetSpotPriceBody>,
  ): Promise<WebSetSpotPriceOutput> {
    const response = await this.api.post<WebSetSpotPriceOutput>('/marketplace/set_spot_price', body, config)
    return response.data
  }

  public async cancelOrder(
    body: WebCancelOrderBody,
    config?: AxiosRequestConfig<WebCancelOrderBody>,
  ): Promise<WebCancelOrderOutput> {
    const response = await this.api.post<WebCancelOrderOutput>('/marketplace/cancel_order', body, config)
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
