import vine from '@vinejs/vine'

export const cartValidator = vine.compile(
    vine.object({
        productId: vine.number(),
    })
)
