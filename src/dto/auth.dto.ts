import { User } from '@types'

export class RegistrationDto implements Omit<User, 'tokens'> {
    public email!: string
    public password!: string
}

export class ActivationDto {
    public email!: string
    public activationCode!: string
    public ip!: string
}
