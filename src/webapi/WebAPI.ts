import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import PQueue from 'p-queue'

import type { CancelOrderRequestData, CancelOrderResponseData } from './endpoints/cancelOrder.js'
import type { CreateOrderRequestData, CreateOrderResponseData } from './endpoints/createOrder.js'
import type { MarketplaceResponseData } from './endpoints/marketplace.js'
import type { MyOrdersRequestData, MyOrdersResponseData } from './endpoints/myOrders.js'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './endpoints/setSpotPrice.js'
import type { SpotMarketplaceRequestData, SpotMarketplaceResponseData } from './endpoints/spotMarketplace.js'
import type { Config, ResponseData } from './types.js'

import { priorityLevels, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER } from '../common/constants.js'
import { UnknownError } from '../common/errors.js'
import { getErrorMessage, getQueueOptions } from '../common/helpers.js'

class WebAPI {
  public axios: AxiosInstance
  public rateLimitQueue: PQueue
  public rateLimitQueueCreateOrder: PQueue

  public constructor(config: Config) {
    this.rateLimitQueue = new PQueue({
      interval: RATE_LIMIT,
      intervalCap: 1,
      concurrency: 1,
      ...config.rateLimitQueueOptions,
    })

    this.rateLimitQueueCreateOrder = new PQueue({
      interval: RATE_LIMIT_CREATE_ORDER,
      intervalCap: 1,
      concurrency: 1,
      ...config.rateLimitQueueOptionsCreateOrder,
    })

    this.axios = axios.create({
      ...config.axiosConfig,
      baseURL: 'https://clore.ai/webapi',
    })

    this.axios.interceptors.request.use((request) => {
      (request.data as unknown) = {
        ...request.data,
        token: config.token,
      }

      return request
    })

    this.axios.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
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
      },
    )
  }

  public async marketplace(
    config?: AxiosRequestConfig,
  ): Promise<MarketplaceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<MarketplaceResponseData>('/marketplace/servers', null, config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myOrders(
    data: MyOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<MyOrdersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<MyOrdersResponseData>('/marketplace/orders', data, config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async spotMarketplace(
    data: SpotMarketplaceRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SpotMarketplaceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SpotMarketplaceResponseData>('/marketplace/get_spot', data, config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async setSpotPrice(
    data: SetSpotPriceRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetSpotPriceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetSpotPriceResponseData>('/marketplace/set_spot_price', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async cancelOrder(
    data: CancelOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrderResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CancelOrderResponseData>('/marketplace/cancel_order', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async createOrder(
    data: CreateOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateOrderResponseData> {
    const response = await this.rateLimitQueueCreateOrder.add(async () => {
      return await this.axios.post<CreateOrderResponseData>('/create_order', data, config)
    }, getQueueOptions(priorityLevels.HIGHEST, config))

    return response.data
  }
}

export default WebAPI
