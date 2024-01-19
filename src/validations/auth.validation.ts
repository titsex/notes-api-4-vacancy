import { body, query } from 'express-validator'

class AuthValidation {
    public static registration = [
        body('email', 'The email must be an email').isEmail(),
        body('password', 'Password length is at least 6 characters').isLength({ min: 8 }),
    ]

    public static activation = [
        query('email', 'The email must be an email').isEmail(),
        query('code', 'The code parameter must not be empty').notEmpty(),
    ]
}

export default AuthValidation
