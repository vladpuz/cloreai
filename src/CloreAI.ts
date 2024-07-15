import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

import { statusCodes } from './constants.js'
import { CustomError, DatabaseError, ExceededError, InvalidApiTokenError, InvalidEndpointError, InvalidInputDataError, UnknownError } from './errors.js'
import { type CancelOrderBody, type CancelOrderOutput } from './types/cloreai/cancelOrder.js'
import { type CreateOrderBody, type CreateOrderOutput } from './types/cloreai/createOrder.js'
import { type MarketplaceOutput } from './types/cloreai/marketplace.js'
import { type MyOrdersOutput, type MyOrdersParams } from './types/cloreai/myOrders.js'
import { type MyServersOutput } from './types/cloreai/myServers.js'
import { type ServerConfigBody, type ServerConfigOutput } from './types/cloreai/serverConfig.js'
import { type SetServerSettingsBody, type SetServerSettingsOutput } from './types/cloreai/setServerSettings.js'
import { type SetSpotPriceBody, type SetSpotPriceOutput } from './types/cloreai/setSpotPrice.js'
import { type SpotMarketplaceOutput, type SpotMarketplaceParams } from './types/cloreai/spotMarketplace.js'
import { type WalletsOutput } from './types/cloreai/wallets.js'
import { type Options } from './types/options.js'
import { type Output } from './types/output.js'

export class CloreAI {
  public readonly api: AxiosInstance

  public constructor(options: Options) {
    const { apiKey, axiosConfig = {} } = options

    this.api = axios.create({
      ...axiosConfig,
      baseURL: 'https://api.clore.ai/v1',
      headers: {
        ...axiosConfig.headers,
        auth: apiKey,
      },
    })

    this.api.interceptors.response.use((response: AxiosResponse<Output>) => {
      if (response.data.code === statusCodes['NORMAL']) {
        return response
      }

      const statusCodeMessage = response.data.code != null ? `Status code "${response.data.code}".` : null
      const errorFieldMessage = response.data.error != null ? `Error field "${response.data.error}".` : null
      const errorMessageArray = [statusCodeMessage, errorFieldMessage].filter((message) => {
        return message != null
      })

      const errorMessage = errorMessageArray.join(' ')

      switch (response.data.code) {
        case statusCodes['DATABASE_ERROR']:
          throw new DatabaseError(errorMessage, undefined, response.config, response.request, response)
        case statusCodes['INVALID_INPUT_DATA']:
          throw new InvalidInputDataError(errorMessage, undefined, response.config, response.request, response)
        case statusCodes['INVALID_API_TOKEN']:
          throw new InvalidApiTokenError(errorMessage, undefined, response.config, response.request, response)
        case statusCodes['INVALID_ENDPOINT']:
          throw new InvalidEndpointError(errorMessage, undefined, response.config, response.request, response)
        case statusCodes['EXCEEDED']:
          throw new ExceededError(errorMessage, undefined, response.config, response.request, response)
        case statusCodes['ERROR']:
          throw new CustomError(errorMessage, undefined, response.config, response.request, response)
        default:
          throw new UnknownError(errorMessage, undefined, response.config, response.request, response)
      }
    })
  }

  public async wallets(): Promise<WalletsOutput> {
    const response = await this.api.get<WalletsOutput>('/wallets')
    return response.data
  }

  public async myServers(): Promise<MyServersOutput> {
    const response = await this.api.get<MyServersOutput>('/my_servers')
    return response.data
  }

  public async serverConfig(body: ServerConfigBody): Promise<ServerConfigOutput> {
    const response = await this.api.get<ServerConfigOutput>('/server_config', { data: body })
    return response.data
  }

  public async marketplace(): Promise<MarketplaceOutput> {
    const response = await this.api.get<MarketplaceOutput>('/marketplace')
    return response.data
  }

  public async myOrders(params?: MyOrdersParams): Promise<MyOrdersOutput> {
    const response = await this.api.get<MyOrdersOutput>('/my_orders', { params })
    return response.data
  }

  public async spotMarketplace(params: SpotMarketplaceParams): Promise<SpotMarketplaceOutput> {
    const response = await this.api.get<SpotMarketplaceOutput>('/spot_marketplace', { params })
    return response.data
  }

  public async setServerSettings(body: SetServerSettingsBody): Promise<SetServerSettingsOutput> {
    const response = await this.api.post<SetServerSettingsOutput>('/set_server_settings', body)
    return response.data
  }

  public async setSpotPrice(body: SetSpotPriceBody): Promise<SetSpotPriceOutput> {
    const response = await this.api.post<SetSpotPriceOutput>('/set_spot_price', body)
    return response.data
  }

  public async cancelOrder(body: CancelOrderBody): Promise<CancelOrderOutput> {
    const response = await this.api.post<CancelOrderOutput>('/cancel_order', body)
    return response.data
  }

  public async createOrder(body: CreateOrderBody): Promise<CreateOrderOutput> {
    const response = await this.api.post<CreateOrderOutput>('/create_order', body)
    return response.data
  }
}
