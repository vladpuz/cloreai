import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from 'axios'
import PQueue, { type Options as PQueueOptions, type Queue, type QueueAddOptions } from 'p-queue'

import type { CancelOrderRequestData, CancelOrderResponseData } from './resources/cancelOrder.ts'
import type { CreateOrderRequestData, CreateOrderResponseData } from './resources/createOrder.ts'
import type { MarketplaceResponseData } from './resources/marketplace.ts'
import type { MyOrdersRequestParams, MyOrdersResponseData } from './resources/myOrders.ts'
import type { MyServersResponseData } from './resources/myServers.ts'
import type { PohBalanceResponseData } from './resources/pohBalance.ts'
import type { RenterFeesResponseData } from './resources/renterFees.ts'
import type { ServerConfigRequestData, ServerConfigResponseData } from './resources/serverConfig.ts'
import type { SetServerSettingsRequestData, SetServerSettingsResponseData } from './resources/setServerSettings.ts'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './resources/setSpotPrice.ts'
import type { SpotMarketplaceRequestParams, SpotMarketplaceResponseData } from './resources/spotMarketplace.ts'
import type { WalletsResponseData } from './resources/wallets.ts'
import type { ResponseData } from './types.ts'

import { CloreaiError } from './CloreaiError.ts'
import { priorityLevels, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER, statusCodes } from './constants.ts'
import { getQueueOptions } from './getQueueOptions.ts'
import Gigaspot from './Gigaspot.ts'

export type QueueOptions = PQueueOptions<
  Queue<() => Promise<unknown>, QueueAddOptions>,
  QueueAddOptions
>

export interface Options {
  axiosOptions?: CreateAxiosDefaults
  queueOptions?: QueueOptions
  queueCreateOrderOptions?: QueueOptions
  queueGigaspotOptions?: QueueOptions
}

class Cloreai {
  axios: AxiosInstance
  queue: PQueue
  queueCreateOrder: PQueue
  gigaspot: Gigaspot

  constructor(apiKey: string, options: Options = {}) {
    this.queue = new PQueue({
      interval: RATE_LIMIT,
      intervalCap: 1,
      concurrency: 1,
      ...options.queueOptions,
    })

    this.queueCreateOrder = new PQueue({
      interval: RATE_LIMIT_CREATE_ORDER,
      intervalCap: 1,
      concurrency: 1,
      ...options.queueCreateOrderOptions,
    })

    this.axios = axios.create({
      baseURL: 'https://api.clore.ai/v1',
      ...options.axiosOptions,
    })

    this.axios.interceptors.request.use((request) => {
      request.headers.set('auth', apiKey)
      return request
    })

    this.axios.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        if (response.data.code === statusCodes.NORMAL) {
          return response
        }

        const errorMessage = `Code "${response.data.code}"`

        const error = new CloreaiError(errorMessage, {
          code: String(response.data.code),
          config: response.config,
          request: response.request,
          response,
        })

        if (response.data.error != null) {
          error.message += `, error "${response.data.error}"`
          error.error = response.data.error
        }

        throw error
      },
    )

    this.gigaspot = new Gigaspot(options, this.axios)
  }

  async wallets(
    config?: AxiosRequestConfig,
  ): Promise<WalletsResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<WalletsResponseData>(
        '/wallets',
        config,
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async myServers(
    config?: AxiosRequestConfig,
  ): Promise<MyServersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<MyServersResponseData>(
        '/my_servers',
        config,
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async serverConfig(
    data: ServerConfigRequestData,
    config?: AxiosRequestConfig,
  ): Promise<ServerConfigResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<ServerConfigResponseData>(
        '/server_config',
        { ...config, data },
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async marketplace(
    config?: AxiosRequestConfig,
  ): Promise<MarketplaceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<MarketplaceResponseData>(
        '/marketplace',
        config,
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async myOrders(
    params?: MyOrdersRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<MyOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<MyOrdersResponseData>(
        '/my_orders',
        { ...config, params },
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async spotMarketplace(
    params: SpotMarketplaceRequestParams,
    config?: AxiosRequestConfig,
  ): Promise<SpotMarketplaceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<SpotMarketplaceResponseData>(
        '/spot_marketplace',
        { ...config, params },
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async setServerSettings(
    data: SetServerSettingsRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetServerSettingsResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<SetServerSettingsResponseData>(
        '/set_server_settings',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGH, this.axios, config))

    return response.data
  }

  async setSpotPrice(
    data: SetSpotPriceRequestData,
    config?: AxiosRequestConfig,
  ): Promise<SetSpotPriceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<SetSpotPriceResponseData>(
        '/set_spot_price',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGH, this.axios, config))

    return response.data
  }

  async cancelOrder(
    data: CancelOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrderResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<CancelOrderResponseData>(
        '/cancel_order',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGH, this.axios, config))

    return response.data
  }

  async createOrder(
    data: CreateOrderRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateOrderResponseData> {
    const response = await this.queueCreateOrder.add(async () => {
      return await this.axios.post<CreateOrderResponseData>(
        '/create_order',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGHEST, this.axios, config))

    return response.data
  }

  async pohBalance(
    config?: AxiosRequestConfig,
  ): Promise<PohBalanceResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<PohBalanceResponseData>(
        '/poh_balance',
        config,
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }

  async renterFees(
    config?: AxiosRequestConfig,
  ): Promise<RenterFeesResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.get<RenterFeesResponseData>(
        '/renter_fees',
        config,
      )
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))

    return response.data
  }
}

export default Cloreai
