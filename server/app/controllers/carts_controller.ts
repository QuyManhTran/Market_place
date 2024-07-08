import User from '#models/user'
import CartService from '#services/cart_service'
import { cartValidator } from '#validators/cart'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class CartsController {
    constructor(protected cartService: CartService) {}
    /**
     * Display a list of resource
     */
    async index({ params }: HttpContext) {
        return this.cartService.index(params.user_id)
    }

    /**
     * Display form to create a new record
     */
    async create({}: HttpContext) {}

    /**
     * Handle form submission for the create action
     */
    async store({ auth, request }: HttpContext) {
        const rawData = request.only(['productId'])
        const { productId } = await cartValidator.validate(rawData)
        return this.cartService.store(auth.user as User, productId)
    }

    /**
     * Show individual record
     */
    // async show({ params }: HttpContext) {}

    /**
     * Edit individual record
     */
    // async edit({ params }: HttpContext) {}

    /**
     * Handle form submission for the edit action
     */
    // async update({ params }: HttpContext) {}

    /**
     * Delete record
     */
    async destroy({ params }: HttpContext) {
        return this.cartService.destroy(params.user_id, params.id)
    }
}
