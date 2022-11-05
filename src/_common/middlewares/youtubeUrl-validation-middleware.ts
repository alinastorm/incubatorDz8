import { body } from 'express-validator';

export const youtubeUrlBodyValidationMiddleware = body('youtubeUrl')
    .exists()
    .notEmpty({ ignore_whitespace: true })
    .isString()
    .isLength({ max: 100 })
    .matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$")
    // .withMessage({ message: 'wrong youtubeUrl', field: "youtubeUrl", code: 400 })
