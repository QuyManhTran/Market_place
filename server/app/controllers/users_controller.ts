import User from '#models/user'
import CloudinaryService from '#services/cloudinary_service'
import UserService from '#services/user_service'
import { CloudinaryResponse } from '#types/cloudinary'
import { fileImageValidator, profileValidator, topUpValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
    constructor(
        protected userService: UserService,
        protected cloudinaryService: CloudinaryService
    ) {}

    async updateProfile({ request, auth }: HttpContext) {
        const rawData = request.only(['age', 'username', 'address', 'phoneNumber'])
        const data = await profileValidator.validate(rawData)
        return this.userService.updateProfile(data, auth.user as User)
    }

    async updateImage({ request, response, auth }: HttpContext) {
        const data = request.only(['column'])
        const { column } = await fileImageValidator.validate(data)
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
        return this.userService.uploadImage(column, cloudinaryResponse, user.id)
    }

    async search({ request, pagination }: HttpContext) {
        const keyword = request.input('keyword', '')
        return this.userService.search(keyword, pagination)
    }

    async topUp({ request, auth }: HttpContext) {
        const rawData = request.only(['amount'])
        const data = await topUpValidator.validate(rawData)
        return this.userService.topUp(data.amount, auth.user as User)
    }

    async getMyStore({ auth }: HttpContext) {
        return this.userService.getMyStore(auth.user as User)
    }
}
