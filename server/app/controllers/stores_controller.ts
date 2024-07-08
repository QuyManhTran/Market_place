import User from '#models/user'
import StoreService from '#services/store_service'
import { storeValidator, updateStoreValidator } from '#validators/store'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class StoresController {
    constructor(protected storeService: StoreService) {}
    /**
     * Display a list of resource
     */
    async index({ pagination }: HttpContext) {
        return this.storeService.index(pagination)
    }

    /**
     * Display form to create a new record
     */
    async create({}: HttpContext) {}

    /**
     * Handle form submission for the create action
     */
    async store({ request, auth }: HttpContext) {
        const rawData = request.only(['storeName', 'description'])
        const data = await storeValidator.validate(rawData)
        return this.storeService.store(data, auth.user as User)
    }

    /**
     * Show individual record
     */
    async show({ params }: HttpContext) {
        return this.storeService.show(params.id)
    }

    /**
     * Edit individual record
     */
    async edit({}: HttpContext) {}

    /**
     * Handle form submission for the edit action
     */
    async update({ params, request, auth }: HttpContext) {
        const rawData = request.only(['storeName', 'description'])
        const data = await updateStoreValidator.validate(rawData)
        return this.storeService.update(data, auth.user as User, params.id)
    }

    /**
     * Delete record
     */
    async destroy({}: HttpContext) {}
}
