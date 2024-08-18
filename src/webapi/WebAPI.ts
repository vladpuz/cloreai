import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import type { CancelOrderBody, CancelOrderOutput } from './endpoints/cancelOrder.js'
import type { CreateOrderBody, CreateOrderOutput } from './endpoints/createOrder.js'
import type { GetSpotBody, GetSpotOutput } from './endpoints/getSpot.js'
import type { OrdersBody, OrdersOutput } from './endpoints/orders.js'
import type { ServersOutput } from './endpoints/servers.js'
import type { SetSpotPriceBody, SetSpotPriceOutput } from './endpoints/setSpotPrice.js'
import type { Config, Output } from './types.js'

import { UnknownError } from '../common/errors.js'
import { getErrorMessage } from '../common/index.js'

export class WebAPI {
  public readonly axios: AxiosInstance

  public constructor(config: Config) {
    const { token, axiosConfig = {} } = config

    this.axios = axios.create({
      ...axiosConfig,
      baseURL: 'https://clore.ai/webapi',
    })

    this.axios.interceptors.request.use((request) => {
      request.data = {
        ...request.data,
        token,
      }

      return request
    })

    this.axios.interceptors.response.use((response: AxiosResponse<Output>) => {
      const hasError = Boolean(response.data.error)

      if (!hasError) {
        return response
      }

      const errorMessage = getErrorMessage(
        response.data.status,
        response.data.error,
      )

      throw new UnknownError(
        errorMessage,
        undefined,
        response.config,
        response.request,
        response,
      )
    })
  }

  public async servers(
    config?: AxiosRequestConfig,
  ): Promise<ServersOutput> {
    const response = await this.axios.post<ServersOutput>('/marketplace/servers', null, config)
    return response.data
  }

  public async orders(
    body: OrdersBody,
    config?: AxiosRequestConfig<OrdersBody>,
  ): Promise<OrdersOutput> {
    const response = await this.axios.post<OrdersOutput>('/marketplace/orders', body, config)
    return response.data
  }

  public async getSpot(
    body: GetSpotBody,
    config?: AxiosRequestConfig<GetSpotBody>,
  ): Promise<GetSpotOutput> {
    const response = await this.axios.post<GetSpotOutput>('/marketplace/get_spot', body, config)
    return response.data
  }

  public async setSpotPrice(
    body: SetSpotPriceBody,
    config?: AxiosRequestConfig<SetSpotPriceBody>,
  ): Promise<SetSpotPriceOutput> {
    const response = await this.axios.post<SetSpotPriceOutput>('/marketplace/set_spot_price', body, config)
    return response.data
  }

  public async cancelOrder(
    body: CancelOrderBody,
    config?: AxiosRequestConfig<CancelOrderBody>,
  ): Promise<CancelOrderOutput> {
    const response = await this.axios.post<CancelOrderOutput>('/marketplace/cancel_order', body, config)
    return response.data
  }

  public async createOrder(
    body: CreateOrderBody,
    config?: AxiosRequestConfig<CreateOrderBody>,
  ): Promise<CreateOrderOutput> {
    const response = await this.axios.post<CreateOrderOutput>('/create_order', body, config)
    return response.data
  }
}
