import User from '#models/user'
import OrderService from '#services/order_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class OrdersController {
    constructor(protected orderService: OrderService) {}
    /**
     * Display a list of resource
     */
    async index({ auth }: HttpContext) {
        return this.orderService.index(auth.user as User)
    }

    /**
     * Display form to create a new record
     */
    // async create({}: HttpContext) {}

    /**
     * Handle form submission for the create action
     */
    async store({ auth }: HttpContext) {
        return this.orderService.store(auth.user as User)
    }

    /**
     * Show individual record
     */
    async show({ params }: HttpContext) {
        return this.orderService.show(params.id)
    }

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
    // async destroy({ params }: HttpContext) {}
}
