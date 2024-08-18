import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

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
import { getErrorMessage, statusCodes } from '../common/index.js'

export class CloreAI {
  public readonly axios: AxiosInstance

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
    config?: AxiosRequestConfig,
  ): Promise<WalletsOutput> {
    const response = await this.axios.get<WalletsOutput>('/wallets', config)
    return response.data
  }

  public async myServers(
    config?: AxiosRequestConfig,
  ): Promise<MyServersOutput> {
    const response = await this.axios.get<MyServersOutput>('/my_servers', config)
    return response.data
  }

  public async serverConfig(
    body: ServerConfigBody,
    config?: AxiosRequestConfig<ServerConfigBody>,
  ): Promise<ServerConfigOutput> {
    const response = await this.axios.get<ServerConfigOutput>('/server_config', { ...config, data: body })
    return response.data
  }

  public async marketplace(
    config?: AxiosRequestConfig,
  ): Promise<MarketplaceOutput> {
    const response = await this.axios.get<MarketplaceOutput>('/marketplace', config)
    return response.data
  }

  public async myOrders(
    params?: MyOrdersParams,
    config?: AxiosRequestConfig,
  ): Promise<MyOrdersOutput> {
    const response = await this.axios.get<MyOrdersOutput>('/my_orders', { ...config, params })
    return response.data
  }

  public async spotMarketplace(
    params: SpotMarketplaceParams,
    config?: AxiosRequestConfig,
  ): Promise<SpotMarketplaceOutput> {
    const response = await this.axios.get<SpotMarketplaceOutput>('/spot_marketplace', { ...config, params })
    return response.data
  }

  public async setServerSettings(
    body: SetServerSettingsBody,
    config?: AxiosRequestConfig<SetServerSettingsBody>,
  ): Promise<SetServerSettingsOutput> {
    const response = await this.axios.post<SetServerSettingsOutput>('/set_server_settings', body, config)
    return response.data
  }

  public async setSpotPrice(
    body: SetSpotPriceBody,
    config?: AxiosRequestConfig<SetSpotPriceBody>,
  ): Promise<SetSpotPriceOutput> {
    const response = await this.axios.post<SetSpotPriceOutput>('/set_spot_price', body, config)
    return response.data
  }

  public async cancelOrder(
    body: CancelOrderBody,
    config?: AxiosRequestConfig<CancelOrderBody>,
  ): Promise<CancelOrderOutput> {
    const response = await this.axios.post<CancelOrderOutput>('/cancel_order', body, config)
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
