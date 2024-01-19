import mongoose, { Schema } from 'mongoose'

import { Token } from '@types'

const TokenSchema = new Schema<Token>({
    token: String,
    lastSignIn: Number,
    ip: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
})

const TokenModel = mongoose.model('tokens', TokenSchema)

export default TokenModel
