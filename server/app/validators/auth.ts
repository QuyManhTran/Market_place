import vine from '@vinejs/vine'

export const registerAuthValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(4).maxLength(20),
        email: vine.string().email(),
        password: vine.string().minLength(6),
    })
)

export const loginAuthValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(6),
    })
)
