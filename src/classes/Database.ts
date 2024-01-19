import Logger from '@class/Logger'
import mongoose from 'mongoose'

import { ApplicationErrorPrefixes } from '@types'
import { ApplicationError } from '@class/Error'

class Database {
    static async connect(url: string) {
        try {
            await mongoose.connect(url, {
                serverSelectionTimeoutMS: 1000,
            })

            Logger.info('Database has been successfully connected!')
        } catch (error) {
            throw new ApplicationError(
                ApplicationErrorPrefixes.DATABASE_CONNECTION,
                (error instanceof Error ? error.message : String(error)) || 'Failed to connect to the database'
            )
        }
    }
}

export default Database
