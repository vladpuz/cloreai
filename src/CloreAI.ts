import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import PQueue, { type QueueAddOptions } from 'p-queue'

import type { CancelOrderRequestData, CancelOrderResponseData } from './endpoints/cancelOrder.js'
import type { CancelOrdersRequestData, CancelOrdersResponseData } from './endpoints/cancelOrders.js'
import type { CreateGigaspotOrdersRequestData, CreateGigaspotOrdersResponseData } from './endpoints/createGigaspotOrders.js'
import type { CreateOrderRequestData, CreateOrderResponseData } from './endpoints/createOrder.js'
import type { EditGigaspotOrdersRequestData, EditGigaspotOrdersResponseData } from './endpoints/editGigaspotOrders.js'
import type { GetGigaspotResponseData, GetGigaspotResponseDataBase, GetGigaspotResponseDataSnapshot } from './endpoints/getGigaspot.js'
import type { MarketplaceResponseData } from './endpoints/marketplace.js'
import type { MyOrdersRequestParams, MyOrdersResponseData } from './endpoints/myOrders.js'
import type { MyServersResponseData } from './endpoints/myServers.js'
import type { ServerConfigRequestData, ServerConfigResponseData } from './endpoints/serverConfig.js'
import type { SetServerSettingsRequestData, SetServerSettingsResponseData } from './endpoints/setServerSettings.js'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './endpoints/setSpotPrice.js'
import type { SpotMarketplaceRequestParams, SpotMarketplaceResponseData } from './endpoints/spotMarketplace.js'
import type { WalletsResponseData } from './endpoints/wallets.js'
import type { Config, ResponseData } from './types.js'

import { priorityLevels, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER, statusCodes } from './constants.js'
import { type AxiosErrorParameters, DatabaseError, ExceededError, InvalidApiTokenError, InvalidEndpointError, InvalidInputDataError, OtherError, UnknownError } from './errors.js'

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

        const errorMessage = response.data.error != null
          ? `Code "${response.status}", error "${response.data.error}"`
          : `Code "${response.status}"`

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

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- Ignore
  private getQueueOptions(
    priority: number,
    config?: AxiosRequestConfig,
  ): QueueAddOptions & { throwOnTimeout: true } {
    const defaultQueueOptions: QueueAddOptions & { throwOnTimeout: true } = {
      throwOnTimeout: true,
      priority,
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- GenericAbortSignal
    const signal = config?.signal as AbortSignal | undefined

    if (signal == null) {
      return defaultQueueOptions
    }

    return {
      ...defaultQueueOptions,
      signal,
    }
  }

  public async wallets(
    config?: AxiosRequestConfig,
  ): Promise<WalletsResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<WalletsResponseData>('/wallets', config)
    }, this.getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myServers(
    config?: AxiosRequestConfig,
  ): Promise<MyServersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MyServersResponseData>('/my_servers', config)
    }, this.getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async serverConfig(
    data: ServerConfigRequestData,
    config?: AxiosRequestConfig,
  ): Promise<ServerConfigResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<ServerConfigResponseData>('/server_config', { ...config, data })
    }, this.getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async marketplace(
    config?: AxiosRequestConfig,
  ): Promise<MarketplaceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MarketplaceResponseData>('/marketplace', config)
    }, this.getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async myOrders(
    params?: MyOrdersRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<MyOrdersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<MyOrdersResponseData>('/my_orders', { ...config, params })
    }, this.getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async spotMarketplace(
    params: SpotMarketplaceRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<SpotMarketplaceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.get<SpotMarketplaceResponseData>('/spot_marketplace', { ...config, params })
    }, this.getQueueOptions(priorityLevels.NORMAL, config))

    return response.data
  }

  public async setServerSettings(
    data: SetServerSettingsRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetServerSettingsResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetServerSettingsResponseData>('/set_server_settings', data, config)
    }, this.getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async setSpotPrice(
    data: SetSpotPriceRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetSpotPriceResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<SetSpotPriceResponseData>('/set_spot_price', data, config)
    }, this.getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async cancelOrder(
    data: CancelOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrderResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CancelOrderResponseData>('/cancel_order', data, config)
    }, this.getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async createOrder(
    data: CreateOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateOrderResponseData> {
    const response = await this.rateLimitQueueCreateOrder.add(async () => {
      return await this.axios.post<CreateOrderResponseData>('/create_order', data, config)
    }, this.getQueueOptions(priorityLevels.HIGHEST, config))

    return response.data
  }

  public async getGigaspot(
    config?: AxiosRequestConfig,
  ): Promise<GetGigaspotResponseData> {
    return await this.rateLimitQueue.add(async () => {
      const response = await this.axios.get<GetGigaspotResponseDataBase>('/get_gigaspot', config)
      const snapshot = await axios.get<GetGigaspotResponseDataSnapshot>(
        response.data.v1_snapshot_url,
      )

      return {
        ...response.data,
        snapshot: snapshot.data,
      }
    }, this.getQueueOptions(priorityLevels.NORMAL, config))
  }

  public async createGigaspotOrders(
    data: CreateGigaspotOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateGigaspotOrdersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CreateGigaspotOrdersResponseData>('/create_gigaspot_orders', data, config)
    }, this.getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async editGigaspotOrders(
    data: EditGigaspotOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<EditGigaspotOrdersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<EditGigaspotOrdersResponseData>('/edit_gigaspot_orders', data, config)
    }, this.getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async cancelOrders(
    data: CancelOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrdersResponseData> {
    const response = await this.rateLimitQueue.add(async () => {
      return await this.axios.post<CancelOrdersResponseData>('/cancel_orders', data, config)
    }, this.getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }
}

export default CloreAI
