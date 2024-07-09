import { JwtExpiration } from '#enums/jwt'
import User from '#models/user'
import { LoginAuth, RegisterAuth } from '#types/auth'
import parseDuration from 'parse-duration'
import env from '#start/env'
import { errors } from '@adonisjs/auth'
import { Exception } from '@adonisjs/core/exceptions'
import jwt from 'jsonwebtoken'
import { Request, ResponseStatus, Response } from '@adonisjs/core/http'
export default class AuthService {
    async register(data: RegisterAuth) {
        const user = await User.create({
            ...data,
        })
        const profile = await user.related('profile').create({})
        await profile.related('avatar').create({})
        await profile.related('background').create({})
        await user.related('cart').create({
            total: 0,
        })

        return {
            result: true,
            message: 'User registered successfully',
        }
    }

    async login({ data, response }: LoginAuth) {
        const user = await User.verifyCredentials(data.email, data.password)
        const accessToken = await User.accessTokens.create(user)
        const refreshToken = await User.accessTokens.createRefresh(user)
        response.cookie('jwt', refreshToken.toJSON().token, {
            httpOnly: true,
            secure: true,
            maxAge: parseDuration(JwtExpiration.REFRESH)! / 1000 || 90 * 24 * 60 * 60,
        })
        await user.load('profile', (builder) => {
            builder.preload('avatar')
            builder.preload('background')
        })
        return {
            result: true,
            data: {
                user: user,
                accessToken: accessToken.toJSON(),
            },
        }
    }

    async refresh({ request }: { request: Request }) {
        const refreshToken = request.cookie('jwt')
        if (!refreshToken)
            throw new Exception('Invalid refresh token', { status: ResponseStatus.Unauthorized })
        const payload = jwt.verify(refreshToken, env.get('JWT_REFRESH_SECRET'))
        if (typeof payload !== 'object' || !('id' in payload)) {
            throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
                guardDriverName: 'jwt',
            })
        }
        const user = await User.findOrFail(payload.id)
        const accessToken = await User.accessTokens.create(user)
        console.log(accessToken)
        return { result: true, data: { accessToken: accessToken.toJSON() } }
    }

    async logout(response: Response) {
        response.clearCookie('jwt')
        return { result: true, message: 'Logout successfull' }
    }
}
