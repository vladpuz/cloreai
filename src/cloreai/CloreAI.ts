import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import PQueue from 'p-queue'

import type { CancelOrderRequestData, CancelOrderResponseData } from './endpoints/cancelOrder.js'
import type { CreateOrderRequestData, CreateOrderResponseData } from './endpoints/createOrder.js'
import type { MarketplaceResponseData } from './endpoints/marketplace.js'
import type { MyOrdersRequestParams, MyOrdersResponseData } from './endpoints/myOrders.js'
import type { MyServersResponseData } from './endpoints/myServers.js'
import type { ServerConfigRequestData, ServerConfigResponseData } from './endpoints/serverConfig.js'
import type { SetServerSettingsRequestData, SetServerSettingsResponseData } from './endpoints/setServerSettings.js'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './endpoints/setSpotPrice.js'
import type { SpotMarketplaceRequestParams, SpotMarketplaceResponseData } from './endpoints/spotMarketplace.js'
import type { WalletsResponseData } from './endpoints/wallets.js'
import type { Config, ResponseData } from './types.js'

import { priorityLevels, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER, statusCodes } from '../common/constants.js'
import { type AxiosErrorParameters, DatabaseError, ExceededError, InvalidApiTokenError, InvalidEndpointError, InvalidInputDataError, OtherError, UnknownError } from '../common/errors.js'
import { getErrorMessage, getQueueOptions } from '../common/helpers.js'

class CloreAI {
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
      baseURL: 'https://api.clore.ai/v1',
    })

    this.axios.interceptors.request.use((request) => {
      request.headers.set('auth', config.apiKey)
      return request
    })

    this.axios.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        if (response.data.code === statusCodes.NORMAL) {
          return response
        }

        const errorMessage = getErrorMessage(
          response.data.code,
          response.data.error,
        )

        const axiosErrorParameters: AxiosErrorParameters = [
          errorMessage,
          undefined,
          response.config,
          response.request,
          response,
        ]

        switch (response.data.code) {
          case statusCodes.DATABASE_ERROR:
            throw new DatabaseError(...axiosErrorParameters)
          case statusCodes.INVALID_INPUT_DATA:
            throw new InvalidInputDataError(...axiosErrorParameters)
          case statusCodes.INVALID_API_TOKEN:
            throw new InvalidApiTokenError(...axiosErrorParameters)
          case statusCodes.INVALID_ENDPOINT:
            throw new InvalidEndpointError(...axiosErrorParameters)
          case statusCodes.EXCEEDED:
            throw new ExceededError(...axiosErrorParameters)
          case statusCodes.OTHER:
            throw new OtherError(...axiosErrorParameters)
          default:
            throw new UnknownError(...axiosErrorParameters)
        }
      },
    )
  }

  public async wallets(
    config?: AxiosRequestConfig,
  ): Promise<WalletsResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<WalletsResponseData>('/wallets', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myServers(
    config?: AxiosRequestConfig,
  ): Promise<MyServersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MyServersResponseData>('/my_servers', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async serverConfig(
    data: ServerConfigRequestData,
    config?: AxiosRequestConfig,
  ): Promise<ServerConfigResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<ServerConfigResponseData>('/server_config', { ...config, data })
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async marketplace(
    config?: AxiosRequestConfig,
  ): Promise<MarketplaceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MarketplaceResponseData>('/marketplace', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myOrders(
    params: MyOrdersRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<MyOrdersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MyOrdersResponseData>('/my_orders', { ...config, params })
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async spotMarketplace(
    params: SpotMarketplaceRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<SpotMarketplaceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<SpotMarketplaceResponseData>('/spot_marketplace', { ...config, params })
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async setServerSettings(
    data: SetServerSettingsRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetServerSettingsResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetServerSettingsResponseData>('/set_server_settings', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async setSpotPrice(
    data: SetSpotPriceRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetSpotPriceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetSpotPriceResponseData>('/set_spot_price', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async cancelOrder(
    data: CancelOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrderResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CancelOrderResponseData>('/cancel_order', data, config)
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

export default CloreAI
