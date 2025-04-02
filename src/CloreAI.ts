import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import PQueue from 'p-queue'

import type { CancelOrderRequestData, CancelOrderResponseData } from './endpoints/cancelOrder.js'
import type { CreateOrderRequestData, CreateOrderResponseData } from './endpoints/createOrder.js'
import type { MarketplaceResponseData } from './endpoints/marketplace.js'
import type { MyOrdersRequestParams, MyOrdersResponseData } from './endpoints/myOrders.js'
import type { MyServersResponseData } from './endpoints/myServers.js'
import type { PohBalanceResponseData } from './endpoints/pohBalance.js'
import type { ServerConfigRequestData, ServerConfigResponseData } from './endpoints/serverConfig.js'
import type { SetServerSettingsRequestData, SetServerSettingsResponseData } from './endpoints/setServerSettings.js'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './endpoints/setSpotPrice.js'
import type { SpotMarketplaceRequestParams, SpotMarketplaceResponseData } from './endpoints/spotMarketplace.js'
import type { WalletsResponseData } from './endpoints/wallets.js'
import type { Config, ResponseData } from './types.js'

import { RATE_LIMIT, RATE_LIMIT_CREATE_ORDER } from './constants.js'
import { DatabaseError, ExceededError, InvalidApiTokenError, InvalidEndpointError, InvalidInputDataError, OtherError, UnknownError } from './errors.js'
import Gigaspot from './Gigaspot.js'
import { getQueueOptions, priorityLevels, statusCodes } from './helpers.js'

class CloreAI {
  public axios: AxiosInstance
  public queue: PQueue
  public queueCreateOrder: PQueue

  public gigaspot: Gigaspot

  public constructor(config: Config) {
    this.queue = new PQueue({
      interval: RATE_LIMIT,
      intervalCap: 1,
      concurrency: 1,
      ...config.queueOptions,
    })

    this.queueCreateOrder = new PQueue({
      interval: RATE_LIMIT_CREATE_ORDER,
      intervalCap: 1,
      concurrency: 1,
      ...config.queueOptionsCreateOrder,
    })

    this.axios = axios.create({
      ...config.axiosOptions,
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

        const errorMessage = response.data.error != null
          ? `Code "${response.data.code}", error "${response.data.error}"`
          : `Code "${response.data.code}"`

        const axiosErrorParameters: ConstructorParameters<typeof AxiosError> = [
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

    this.gigaspot = new Gigaspot(config, this.axios)
  }

  public async wallets(
    config?: AxiosRequestConfig,
  ): Promise<WalletsResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<WalletsResponseData>('/wallets', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myServers(
    config?: AxiosRequestConfig,
  ): Promise<MyServersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<MyServersResponseData>('/my_servers', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async serverConfig(
    data: ServerConfigRequestData,
    config?: AxiosRequestConfig,
  ): Promise<ServerConfigResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<ServerConfigResponseData>('/server_config', { ...config, data })
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async marketplace(
    config?: AxiosRequestConfig,
  ): Promise<MarketplaceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<MarketplaceResponseData>('/marketplace', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myOrders(
    params?: MyOrdersRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<MyOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<MyOrdersResponseData>('/my_orders', { ...config, params })
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async spotMarketplace(
    params: SpotMarketplaceRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<SpotMarketplaceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<SpotMarketplaceResponseData>('/spot_marketplace', { ...config, params })
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async setServerSettings(
    data: SetServerSettingsRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetServerSettingsResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<SetServerSettingsResponseData>('/set_server_settings', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async setSpotPrice(
    data: SetSpotPriceRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetSpotPriceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<SetSpotPriceResponseData>('/set_spot_price', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async cancelOrder(
    data: CancelOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrderResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<CancelOrderResponseData>('/cancel_order', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async createOrder(
    data: CreateOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateOrderResponseData> {
    const response = await this.queueCreateOrder.add(async () => {
      return await this.axios.post<CreateOrderResponseData>('/create_order', data, config)
    }, getQueueOptions(priorityLevels.HIGHEST, config))

    return response.data
  }

  public async pohBalance(
    config?: AxiosRequestConfig,
  ): Promise<PohBalanceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<PohBalanceResponseData>('/poh_balance', config)
    }, getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }
}

export default CloreAI
