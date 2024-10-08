import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import PQueue, { type QueueAddOptions } from 'p-queue'

import type { CancelOrderBody, CancelOrderOutput } from './endpoints/cancelOrder.js'
import type { CreateOrderBody, CreateOrderOutput } from './endpoints/createOrder.js'
import type { GetSpotBody, GetSpotOutput } from './endpoints/getSpot.js'
import type { OrdersBody, OrdersOutput } from './endpoints/orders.js'
import type { ServersOutput } from './endpoints/servers.js'
import type { SetSpotPriceBody, SetSpotPriceOutput } from './endpoints/setSpotPrice.js'
import type { Config, Output } from './types.js'

import { UnknownError } from '../common/errors.js'
import { getErrorMessage, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER } from '../common/index.js'

class WebAPI {
  public readonly axios: AxiosInstance

  public readonly rateLimitQueue: PQueue = new PQueue({
    interval: RATE_LIMIT,
    intervalCap: 1,
    concurrency: 1,
  })

  public readonly rateLimitCreateOrderQueue: PQueue = new PQueue({
    interval: RATE_LIMIT_CREATE_ORDER,
    intervalCap: 1,
    concurrency: 1,
  })

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
    axiosConfig?: AxiosRequestConfig,
    queueOptions?: QueueAddOptions,
  ): Promise<ServersOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<ServersOutput>('/marketplace/servers', null, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async orders(
    body: OrdersBody,
    axiosConfig?: AxiosRequestConfig<OrdersBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<OrdersOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<OrdersOutput>('/marketplace/orders', body, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async getSpot(
    body: GetSpotBody,
    axiosConfig?: AxiosRequestConfig<GetSpotBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<GetSpotOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<GetSpotOutput>('/marketplace/get_spot', body, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async setSpotPrice(
    body: SetSpotPriceBody,
    axiosConfig?: AxiosRequestConfig<SetSpotPriceBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<SetSpotPriceOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetSpotPriceOutput>('/marketplace/set_spot_price', body, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async cancelOrder(
    body: CancelOrderBody,
    axiosConfig?: AxiosRequestConfig<CancelOrderBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<CancelOrderOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CancelOrderOutput>('/marketplace/cancel_order', body, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async createOrder(
    body: CreateOrderBody,
    axiosConfig?: AxiosRequestConfig<CreateOrderBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<CreateOrderOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      this.rateLimitQueue.pause()

      try {
        return await this.rateLimitCreateOrderQueue.add(async () => {
          return await this.axios.post<CreateOrderOutput>('/create_order', body, axiosConfig)
        }, { ...queueOptions, throwOnTimeout: true })
      } finally {
        setTimeout(() => {
          this.rateLimitQueue.start()
        }, RATE_LIMIT)
      }
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }
}

export default WebAPI
