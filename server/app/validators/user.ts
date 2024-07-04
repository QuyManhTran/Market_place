import vine from '@vinejs/vine'

export const fileValidator = vine.compile(
    vine.object({
        avatar: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'pdf'],
        }),
    })
)

export const profileValidator = vine.compile(
    vine.object({
        age: vine.number().min(0).optional(),
        username: vine.string().minLength(4).maxLength(20).optional(),
        address: vine.string().optional(),
        phoneNumber: vine.string().optional(),
    })
)

export const fileImageValidator = vine.compile(
    vine.object({
        column: vine.enum(['avatars', 'backgrounds']),
    })
)
