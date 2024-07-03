import cloudinary from '#config/cloudinary'
import UserService from '#services/user_service'
import { fileValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

@inject()
export default class UsersController {
    constructor(protected userService: UserService) {}

    async updateAvatar({ request }: HttpContext) {
        // const { avatar } = await request.validateUsing(fileValidator)
        // console.log(avatar)

        request.multipart.onFile(
            'avatar',
            {
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            },
            async (part, reporter) => {
                part.pause()
                part.on('data', (buffer) => {
                    console.log('Received a buffer with length', buffer)
                })
                // const filePath = app.makePath(`uploads/${part.file.clientName}`)
                const uploadStream = cloudinary.uploader.upload_chunked_stream(
                    {
                        resource_type: 'image',
                        folder: 'Market_place/avatars',
                    },
                    (error, result) => {
                        if (error) return error
                        return result
                    }
                )
                await pipeline(part, uploadStream)
            }
        )

        /**
         * Step 2: Process the stream
         */
        await request.multipart.process()
    }
}
