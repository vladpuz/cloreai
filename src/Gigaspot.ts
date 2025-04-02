import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import PQueue from 'p-queue'

import type { CancelOrdersRequestData, CancelOrdersResponseData } from './endpoints/cancelOrders.js'
import type { CreateGigaspotOrdersRequestData, CreateGigaspotOrdersResponseData } from './endpoints/createGigaspotOrders.js'
import type { EditGigaspotOrdersRequestData, EditGigaspotOrdersResponseData } from './endpoints/editGigaspotOrders.js'
import type { GetGigaspotResponseData, GetGigaspotResponseDataBase, GetGigaspotResponseDataSnapshot } from './endpoints/getGigaspot.js'
import type { Config } from './types.js'

import { RATE_LIMIT_GIGASPOT } from './constants.js'
import { getQueueOptions, priorityLevels } from './helpers.js'

class Gigaspot {
  public queue: PQueue
  private readonly axios: AxiosInstance

  public constructor(config: Config, axios: AxiosInstance) {
    this.queue = new PQueue({
      interval: RATE_LIMIT_GIGASPOT,
      intervalCap: 1,
      concurrency: 1,
      ...config.queueOptionsGigaspot,
    })

    this.axios = axios
  }

  public async getGigaspot(
    config?: AxiosRequestConfig,
  ): Promise<GetGigaspotResponseData> {
    return await this.queue.add(async () => {
      const response = await this.axios.get<GetGigaspotResponseDataBase>('/get_gigaspot', config)
      const snapshot = await axios.get<GetGigaspotResponseDataSnapshot>(
        response.data.v1_snapshot_url,
      )

      return {
        ...response.data,
        snapshot: snapshot.data,
      }
    }, getQueueOptions(priorityLevels.NORMAL, config))
  }

  public async createGigaspotOrders(
    data: CreateGigaspotOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateGigaspotOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<CreateGigaspotOrdersResponseData>('/create_gigaspot_orders', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async editGigaspotOrders(
    data: EditGigaspotOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<EditGigaspotOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<EditGigaspotOrdersResponseData>('/edit_gigaspot_orders', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }

  public async cancelOrders(
    data: CancelOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<CancelOrdersResponseData>('/cancel_orders', data, config)
    }, getQueueOptions(priorityLevels.HIGH, config))

    return response.data
  }
}

export default Gigaspot
