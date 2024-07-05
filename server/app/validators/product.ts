import { ProductStatus } from '#enums/product'
import vine from '@vinejs/vine'

export const productValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(4).maxLength(255),
        description: vine.string().minLength(3),
        price: vine.number().min(0),
        status: vine.enum(Object.values(ProductStatus)).optional(),
    })
)

export const updateProductValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(4).maxLength(255),
        description: vine.string().minLength(3),
        price: vine.number().min(0),
        status: vine.enum(Object.values(ProductStatus)),
    })
)
