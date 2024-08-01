// import type { HttpContext } from '@adonisjs/core/http'

import AuthService from '#services/auth_service'
import { loginAuthValidator, registerAuthValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
@inject()
export default class AuthController {
    constructor(protected authService: AuthService) {}
    async register({ request, response }: HttpContext) {
        const rawData = request.only(['username', 'email', 'password'])
        const data = await registerAuthValidator.validate(rawData)
        const user = await this.authService.register(data)
        return response.created(user)
    }

    async login({ request, response }: HttpContext) {
        // LoginAuth
        const rawData = request.only(['email', 'password'])
        const data = await loginAuthValidator.validate(rawData)
        return this.authService.login({ data, response })
    }

    async refresh({ request }: HttpContext) {
        return this.authService.refresh({ request })
    }

    async logout({ response }: HttpContext) {
        return this.authService.logout(response)
    }
}
