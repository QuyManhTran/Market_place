import vine from '@vinejs/vine'

export const storeValidator = vine.compile(
    vine.object({
        storeName: vine.string().minLength(4).maxLength(255),
        description: vine.string().minLength(3),
    })
)

export const updateStoreValidator = vine.compile(
    vine.object({
        storeName: vine.string().minLength(4).maxLength(255).optional(),
        description: vine.string().minLength(3).optional(),
    })
)
