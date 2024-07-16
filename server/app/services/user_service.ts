import Avatar from '#models/avatar'
import Background from '#models/background'
import Profile from '#models/profile'
import { CloudinaryResponse } from '#types/cloudinary'
import { inject } from '@adonisjs/core'
import CloudinaryService from './cloudinary_service.js'
import { ProfileUser } from '#types/user'
import User from '#models/user'
import { Pagination, PaginationMeta } from '#types/pagination'
@inject()
export default class UserService {
    constructor(protected cloudinaryService: CloudinaryService) {}
    async updateProfile(data: ProfileUser, user: User) {
        if (data.username) await user?.merge({ username: data.username }).save()
        const profile = await Profile.findByOrFail('user_id', user?.id)
        if (data.address) profile.address = data.address
        if (data.age) profile.age = data.age
        if (data.phoneNumber) profile.phoneNumber = data.phoneNumber
        await profile.save()
        await user?.load('profile')
        return {
            result: true,
            data: {
                user: user.serialize(),
            },
        }
    }

    async uploadImage(property: string, cloudinaryResponse: CloudinaryResponse, userId: number) {
        const profile = await Profile.findByOrFail('user_id', userId)
        if (property === 'avatars') {
            const avatar = await Avatar.findByOrFail('profile_id', profile.id)
            if (avatar.publicId) {
                const response = await this.cloudinaryService.deleteImage(avatar.publicId)
                console.log(response)
            }
            await avatar
                .merge({
                    publicId: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                })
                .save()
            return {
                result: true,
                data: {
                    avatar: avatar.url,
                },
            }
        }
        const background = await Background.findByOrFail('profile_id', profile.id)
        if (background.publicId) {
            const response = await this.cloudinaryService.deleteImage(background.publicId)
            console.log(response)
        }
        await background
            .merge({
                publicId: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            })
            .save()
        return {
            result: true,
            data: {
                background: background.url,
            },
        }
    }

    async search(keyword: string, { curPage, perPage }: Pagination) {
        const users = await User.query()
            .where((query) => {
                keyword && query.where('username', 'like', `%${keyword}%`)
            })
            .preload('profile')
            .paginate(curPage, perPage)

        const meta: PaginationMeta = {
            total: users.getMeta().total,
            perPage: users.getMeta().perPage,
            currentPage: users.getMeta().currentPage,
            lastPage: users.getMeta().lastPage,
            firstPage: users.getMeta().firstPage,
        }
        return {
            result: true,
            data: {
                users: {
                    meta,
                    data: users.all(),
                },
            },
        }
    }

    async topUp(amount: number, user: User) {
        await user.merge({ balance: user.balance + amount }).save()
        return {
            result: true,
            data: {
                balance: user.balance,
            },
        }
    }
}
