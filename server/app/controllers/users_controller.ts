import CloudinaryService from '#services/cloudinary_service'
import UserService from '#services/user_service'
import { CloudinaryResponse } from '#types/cloudinary'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
    constructor(
        protected userService: UserService,
        protected cloudinaryService: CloudinaryService
    ) {}

    async updateImage({ request, response, auth }: HttpContext) {
        const column = request.input('column', 'avatars')
        let cloudinaryResponse: CloudinaryResponse | null = null
        const user = auth.user
        if (!user) {
            return response.unauthorized({
                result: false,
                message: 'Unauthorized',
            })
        }

        request.multipart.onFile(
            'avatar',
            {
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            },
            async (part, reporter) => {
                part.pause()
                part.on('data', reporter)
                const uploadResponse = await this.cloudinaryService.uploadImage(part, column)
                cloudinaryResponse = uploadResponse
            }
        )

        await request.multipart.process()
        if (cloudinaryResponse === null) return response.internalServerError()
        const property = request.input('property', 'avatars')
        return this.userService.uploadImage(property, cloudinaryResponse, user.id)
    }
}
