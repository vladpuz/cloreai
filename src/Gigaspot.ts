import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import PQueue from 'p-queue'

import type { Options } from './Cloreai.ts'
import type { CancelOrdersRequestData, CancelOrdersResponseData } from './resources/cancelOrders.ts'
import type { CreateGigaspotOrdersRequestData, CreateGigaspotOrdersResponseData } from './resources/createGigaspotOrders.ts'
import type { EditGigaspotOrdersRequestData, EditGigaspotOrdersResponseData } from './resources/editGigaspotOrders.ts'
import type { GetGigaspotResponseData, GetGigaspotResponseDataBase, GetGigaspotSnapshot } from './resources/getGigaspot.ts'

import { priorityLevels, RATE_LIMIT_GIGASPOT } from './constants.ts'
import { getQueueOptions } from './getQueueOptions.ts'

class Gigaspot {
  axios: AxiosInstance
  queue: PQueue

  constructor(options: Options, axios: AxiosInstance) {
    this.queue = new PQueue({
      interval: RATE_LIMIT_GIGASPOT,
      intervalCap: 1,
      concurrency: 1,
      ...options.queueGigaspotOptions,
    })

    this.axios = axios
  }

  async getGigaspot(
    config?: AxiosRequestConfig,
  ): Promise<GetGigaspotResponseData> {
    return await this.queue.add(async () => {
      const response = await this.axios.get<GetGigaspotResponseDataBase>(
        '/get_gigaspot',
        config,
      )

      const snapshot = await axios.get<GetGigaspotSnapshot>(
        response.data.v1_snapshot_url,
      )

      return {
        ...response.data,
        snapshot: snapshot.data,
      }
    }, getQueueOptions(priorityLevels.NORMAL, this.axios, config))
  }

  async createGigaspotOrders(
    data: CreateGigaspotOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CreateGigaspotOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<CreateGigaspotOrdersResponseData>(
        '/create_gigaspot_orders',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGH, this.axios, config))

    return response.data
  }

  async editGigaspotOrders(
    data: EditGigaspotOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<EditGigaspotOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<EditGigaspotOrdersResponseData>(
        '/edit_gigaspot_orders',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGH, this.axios, config))

    return response.data
  }

  async cancelOrders(
    data: CancelOrdersRequestData,
    config?: AxiosRequestConfig,
  ): Promise<CancelOrdersResponseData> {
    const response = await this.queue.add(async () => {
      return await this.axios.post<CancelOrdersResponseData>(
        '/cancel_orders',
        data,
        config,
      )
    }, getQueueOptions(priorityLevels.HIGH, this.axios, config))

    return response.data
  }
}

export default Gigaspot
