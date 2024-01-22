import Logger from '@class/Logger'

import { createClient, RedisClientType } from 'redis'
import { ApplicationErrorPrefixes } from '@types'
import { ApplicationError } from '@class/Error'

class Cache {
    private static client: RedisClientType

    public static async connect(url: string) {
        try {
            Cache.client = createClient({
                url,
            })

            await Cache.client.connect()

            Logger.info('Cache has been successfully connected!')
        } catch (error) {
            throw new ApplicationError(
                ApplicationErrorPrefixes.CACHE_CONNECTION,
                (error instanceof Error ? error.message : String(error)) || 'Failed to connect to the cache'
            )
        }
    }

    public static async get(key: string) {
        try {
            return await this.client.get(`${key}`)
        } catch (error) {
            throw new Error('An error has occurred. Data could not be retrieved.')
        }
    }

    public static async set(key: string, value: string) {
        try {
            await this.client.set(`${key}`, value, { EX: 60 * 5 })
        } catch (error) {
            throw new Error('An error has occurred. Data could not be saved.')
        }
    }

    public static async delete(key: string) {
        try {
            await this.client.del(`${key}`)
        } catch (error) {
            throw new Error('An error has occurred. Failed to delete data.')
        }
    }
}

export default Cache
