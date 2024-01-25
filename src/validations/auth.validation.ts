import { body, param } from 'express-validator'

class AuthValidation {
    public static registration = [
        body('email', 'The email must be an email').isEmail(),
        body('password', 'Password length is at least 6 characters').isLength({ min: 8 }),
    ]

    public static activation = [
        param('email', 'The email must be an email').isEmail(),
        param('code', 'The code parameter must not be empty').notEmpty(),
    ]

    public static login = [
        body('email', 'The email must be an email').isEmail(),
        body('password', 'Password length is at least 6 characters').isLength({ min: 8 }),
    ]
}

export default AuthValidation
