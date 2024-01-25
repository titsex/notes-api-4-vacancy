export class RegistrationDto {
    public email!: string
    public password!: string
}

export class ActivationDto {
    public email!: string
    public code!: string
    public ip!: string
}

export class LoginDto {
    public email!: string
    public password!: string
    public ip!: string
}

export class RefreshDto {
    public refreshToken!: string
    public ip!: string
}
