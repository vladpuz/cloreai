import type { CancelOrderRequestData, CancelOrderResponseData } from './resources/cancelOrder.ts'
import type { CancelOrdersRequestData, CancelOrdersResponseData } from './resources/cancelOrders.ts'
import type { CreateOrderRequestData, CreateOrderResponseData } from './resources/createOrder.ts'
import type { MarketplaceResponseData } from './resources/marketplace.ts'
import type { MyOrdersRequestParams, MyOrdersResponseData } from './resources/myOrders.ts'
import type { MyServersResponseData } from './resources/myServers.ts'
import type { OrderRenewalsRequestData, OrderRenewalsResponseData } from './resources/orderRenewals.ts'
import type { PohBalanceResponseData } from './resources/pohBalance.ts'
import type { RenterFeesResponseData } from './resources/renterFees.ts'
import type { ServerConfigRequestData, ServerConfigResponseData } from './resources/serverConfig.ts'
import type { SetOrderAutoRenewRequestData, SetOrderAutoRenewResponseData } from './resources/setOrderAutoRenew.ts'
import type { SetServerSettingsRequestData, SetServerSettingsResponseData } from './resources/setServerSettings.ts'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './resources/setSpotPrice.ts'
import type { SpotMarketplaceRequestParams, SpotMarketplaceResponseData } from './resources/spotMarketplace.ts'
import type { WalletsResponseData } from './resources/wallets.ts'

import { CloreaiError, type ErrorData } from './CloreaiError.ts'
import { statusCodes } from './constants.ts'

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

export interface Options {
  baseURL?: string
  fetchOptions?: RequestInit
  fetch?: typeof fetch
}

class Cloreai {
  apiKey: string
  baseURL: string
  fetchOptions: RequestInit
  fetch: typeof fetch

  constructor(apiKey: string, options: Options = {}) {
    this.apiKey = apiKey
    this.baseURL = options.baseURL ?? 'https://api.clore.ai/v1'
    this.fetchOptions = options.fetchOptions ?? {}
    this.fetch = options.fetch ?? fetch
  }

  async #fetch(input: URL, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'auth': this.apiKey,
    })

    for (const [key, value] of new Headers(this.fetchOptions.headers)) {
      headers.set(key, value)
    }

    for (const [key, value] of new Headers(init.headers)) {
      headers.set(key, value)
    }

    const signal = AbortSignal.any([
      ...(this.fetchOptions.signal ? [this.fetchOptions.signal] : []),
      ...(init.signal ? [init.signal] : []),
    ])

    const mergedInit: RequestInit = {
      ...this.fetchOptions,
      ...init,
      headers,
      signal,
    }

    const request = new Request(input, mergedInit)
    const response = await this.fetch(request)

    const originalJson = response.json

    // @ts-expect-error: json is readonly
    response.json = async () => {
      const data = await originalJson.call(response) as ErrorData

      if (data.code === statusCodes.NORMAL) {
        return data
      }

      const hasError = Boolean(data.error)
      const errorMessage = hasError
        ? `Code "${data.code}, error "${data.error}"`
        : `Code "${data.code}"`

      throw new CloreaiError(errorMessage, {
        request,
        response,
        data,
      })
    }

    return response
  }

  async wallets(
    init: RequestInit = {},
  ): Promise<WalletsResponseData> {
    const url = new URL(this.baseURL + '/wallets')

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as WalletsResponseData
  }

  async myServers(
    init: RequestInit = {},
  ): Promise<MyServersResponseData> {
    const url = new URL(this.baseURL + '/my_servers')

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as MyServersResponseData
  }

  async serverConfig(
    data: ServerConfigRequestData,
    init: RequestInit = {},
  ): Promise<ServerConfigResponseData> {
    const url = new URL(this.baseURL + '/server_config')

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
      body: JSON.stringify(data),
    })

    return await response.json() as ServerConfigResponseData
  }

  async marketplace(
    init: RequestInit = {},
  ): Promise<MarketplaceResponseData> {
    const url = new URL(this.baseURL + '/marketplace')

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as MarketplaceResponseData
  }

  async myOrders(
    params: MyOrdersRequestParams = {},
    init: RequestInit = {},
  ): Promise<MyOrdersResponseData> {
    const url = new URL(this.baseURL + '/my_orders')

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as MyOrdersResponseData
  }

  async spotMarketplace(
    params: SpotMarketplaceRequestParams,
    init: RequestInit = {},
  ): Promise<SpotMarketplaceResponseData> {
    const url = new URL(this.baseURL + '/spot_marketplace')

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as SpotMarketplaceResponseData
  }

  async setServerSettings(
    data: SetServerSettingsRequestData,
    init: RequestInit = {},
  ): Promise<SetServerSettingsResponseData> {
    const url = new URL(this.baseURL + '/set_server_settings')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as SetServerSettingsResponseData
  }

  async setSpotPrice(
    data: SetSpotPriceRequestData,
    init: RequestInit = {},
  ): Promise<SetSpotPriceResponseData> {
    const url = new URL(this.baseURL + '/set_spot_price')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as SetSpotPriceResponseData
  }

  async cancelOrder(
    data: CancelOrderRequestData,
    init: RequestInit = {},
  ): Promise<CancelOrderResponseData> {
    const url = new URL(this.baseURL + '/cancel_order')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as CancelOrderResponseData
  }

  async cancelOrders(
    data: CancelOrdersRequestData,
    init: RequestInit = {},
  ): Promise<CancelOrdersResponseData> {
    const url = new URL(this.baseURL + '/cancel_orders')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as CancelOrdersResponseData
  }

  async createOrder(
    data: CreateOrderRequestData,
    init: RequestInit = {},
  ): Promise<CreateOrderResponseData> {
    const url = new URL(this.baseURL + '/create_order')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as CreateOrderResponseData
  }

  async setOrderAutoRenew(
    data: SetOrderAutoRenewRequestData,
    init: RequestInit = {},
  ): Promise<SetOrderAutoRenewResponseData> {
    const url = new URL(this.baseURL + '/set_order_auto_renew')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as SetOrderAutoRenewResponseData
  }

  async orderRenewals(
    data: OrderRenewalsRequestData,
    init: RequestInit = {},
  ): Promise<OrderRenewalsResponseData> {
    const url = new URL(this.baseURL + '/order_renewals')

    const response = await this.#fetch(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await response.json() as OrderRenewalsResponseData
  }

  async pohBalance(
    init: RequestInit = {},
  ): Promise<PohBalanceResponseData> {
    const url = new URL(this.baseURL + '/poh_balance')

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as PohBalanceResponseData
  }

  async renterFees(
    init: RequestInit = {},
  ): Promise<RenterFeesResponseData> {
    const url = new URL(this.baseURL + '/renter_fees')

    const response = await this.#fetch(url, {
      ...init,
      method: 'GET',
    })

    return await response.json() as RenterFeesResponseData
  }
}

export default Cloreai
