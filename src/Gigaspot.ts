import type Cloreai from './Cloreai.ts'
import type { CancelOrdersRequestData, CancelOrdersResponseData } from './resources/cancelOrders.ts'
import type { CreateGigaspotOrdersRequestData, CreateGigaspotOrdersResponseData } from './resources/createGigaspotOrders.ts'
import type { EditGigaspotOrdersRequestData, EditGigaspotOrdersResponseData } from './resources/editGigaspotOrders.ts'
import type { GetGigaspotResponseData, GetGigaspotResponseDataBase, GetGigaspotSnapshot } from './resources/getGigaspot.ts'

import { priorityLevels } from './constants.ts'

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

type Fetch = (input: string | URL, init?: RequestInit) => Promise<Response>

class Gigaspot {
  #cloreai: Cloreai
  #fetch: Fetch

  constructor(cloreai: Cloreai, fetch: Fetch) {
    this.#cloreai = cloreai
    this.#fetch = fetch
  }

  async getGigaspot(
    init: RequestInit = {},
  ): Promise<GetGigaspotResponseData> {
    const url = new URL(this.#cloreai.baseURL + '/get_gigaspot')

    const response = await this.#cloreai.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    const data = await response.json() as GetGigaspotResponseDataBase

    const snapshotResponse = await fetch(data.v1_snapshot_url)
    const snapshotData = await snapshotResponse.json() as GetGigaspotSnapshot

    return {
      ...data,
      snapshot: snapshotData,
    }
  }

  async createGigaspotOrders(
    data: CreateGigaspotOrdersRequestData,
    init: RequestInit = {},
  ): Promise<CreateGigaspotOrdersResponseData> {
    const url = new URL(this.#cloreai.baseURL + '/create_gigaspot_orders')

    const response = await this.#cloreai.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGH,
      signal: init.signal ?? undefined,
    })

    return await response.json() as CreateGigaspotOrdersResponseData
  }

  async editGigaspotOrders(
    data: EditGigaspotOrdersRequestData,
    init: RequestInit = {},
  ): Promise<EditGigaspotOrdersResponseData> {
    const url = new URL(this.#cloreai.baseURL + '/edit_gigaspot_orders')

    const response = await this.#cloreai.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGH,
      signal: init.signal ?? undefined,
    })

    return await response.json() as EditGigaspotOrdersResponseData
  }

  async cancelOrders(
    data: CancelOrdersRequestData,
    init: RequestInit = {},
  ): Promise<CancelOrdersResponseData> {
    const url = new URL(this.#cloreai.baseURL + '/cancel_orders')

    const response = await this.#cloreai.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGH,
      signal: init.signal ?? undefined,
    })

    return await response.json() as CancelOrdersResponseData
  }
}

export default Gigaspot
