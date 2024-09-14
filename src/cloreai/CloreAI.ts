import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import PQueue, { type QueueAddOptions } from 'p-queue'

import type { AxiosErrorParameters } from '../common/types.js'
import type { CancelOrderBody, CancelOrderOutput } from './endpoints/cancelOrder.js'
import type { CreateOrderBody, CreateOrderOutput } from './endpoints/createOrder.js'
import type { MarketplaceOutput } from './endpoints/marketplace.js'
import type { MyOrdersOutput, MyOrdersParams } from './endpoints/myOrders.js'
import type { MyServersOutput } from './endpoints/myServers.js'
import type { ServerConfigBody, ServerConfigOutput } from './endpoints/serverConfig.js'
import type { SetServerSettingsBody, SetServerSettingsOutput } from './endpoints/setServerSettings.js'
import type { SetSpotPriceBody, SetSpotPriceOutput } from './endpoints/setSpotPrice.js'
import type { SpotMarketplaceOutput, SpotMarketplaceParams } from './endpoints/spotMarketplace.js'
import type { WalletsOutput } from './endpoints/wallets.js'
import type { Config, Output } from './types.js'

import { CustomError, DatabaseError, ExceededError, InvalidApiTokenError, InvalidEndpointError, InvalidInputDataError, UnknownError } from '../common/errors.js'
import { getErrorMessage, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER, statusCodes } from '../common/index.js'

class CloreAI {
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
    const { apiKey, axiosConfig = {} } = config

    this.axios = axios.create({
      ...axiosConfig,
      baseURL: 'https://api.clore.ai/v1',
      headers: {
        ...axiosConfig.headers,
        auth: apiKey,
      },
    })

    this.axios.interceptors.response.use((response: AxiosResponse<Output>) => {
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
        case statusCodes.ERROR:
          throw new CustomError(...axiosErrorParameters)
        default:
          throw new UnknownError(...axiosErrorParameters)
      }
    })
  }

  public async wallets(
    axiosConfig?: AxiosRequestConfig,
    queueOptions?: QueueAddOptions,
  ): Promise<WalletsOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<WalletsOutput>('/wallets', axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async myServers(
    axiosConfig?: AxiosRequestConfig,
    queueOptions?: QueueAddOptions,
  ): Promise<MyServersOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MyServersOutput>('/my_servers', axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async serverConfig(
    body: ServerConfigBody,
    axiosConfig?: AxiosRequestConfig<ServerConfigBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<ServerConfigOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<ServerConfigOutput>('/server_config', { ...axiosConfig, data: body })
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async marketplace(
    axiosConfig?: AxiosRequestConfig,
    queueOptions?: QueueAddOptions,
  ): Promise<MarketplaceOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MarketplaceOutput>('/marketplace', axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async myOrders(
    params?: MyOrdersParams,
    axiosConfig?: AxiosRequestConfig,
    queueOptions?: QueueAddOptions,
  ): Promise<MyOrdersOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MyOrdersOutput>('/my_orders', { ...axiosConfig, params })
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async spotMarketplace(
    params: SpotMarketplaceParams,
    axiosConfig?: AxiosRequestConfig,
    queueOptions?: QueueAddOptions,
  ): Promise<SpotMarketplaceOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<SpotMarketplaceOutput>('/spot_marketplace', { ...axiosConfig, params })
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async setServerSettings(
    body: SetServerSettingsBody,
    axiosConfig?: AxiosRequestConfig<SetServerSettingsBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<SetServerSettingsOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetServerSettingsOutput>('/set_server_settings', body, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async setSpotPrice(
    body: SetSpotPriceBody,
    axiosConfig?: AxiosRequestConfig<SetSpotPriceBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<SetSpotPriceOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetSpotPriceOutput>('/set_spot_price', body, axiosConfig)
    }, { ...queueOptions, throwOnTimeout: true })

    return response.data
  }

  public async cancelOrder(
    body: CancelOrderBody,
    axiosConfig?: AxiosRequestConfig<CancelOrderBody>,
    queueOptions?: QueueAddOptions,
  ): Promise<CancelOrderOutput> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CancelOrderOutput>('/cancel_order', body, axiosConfig)
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

export default CloreAI
