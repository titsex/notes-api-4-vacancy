import { User } from '@types'

class UserPayload {
    public email!: string

    constructor(user: User) {
        this.email = user.email
    }
}

export default UserPayload
