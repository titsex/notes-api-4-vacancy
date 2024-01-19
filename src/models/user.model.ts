import mongoose, { Schema } from 'mongoose'

import { User } from '@types'

const UserSchema = new Schema<User>({
    email: String,
    password: String,
})

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
