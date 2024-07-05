import { ProductStatus } from '#enums/product'
import User from '#models/user'
import CloudinaryService from '#services/cloudinary_service'
import ProductService from '#services/product_service'
import { CloudinaryResponse } from '#types/cloudinary'
import { productValidator, updateProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class ProductsController {
    constructor(
        protected productService: ProductService,
        protected cloudinaryService: CloudinaryService
    ) {}
    /**
     * Display a list of resource
     */
    async index({}: HttpContext) {}

    /**
     * Display form to create a new record
     */
    async create({}: HttpContext) {}

    /**
     * Handle form submission for the create action
     */
    async store({ request, auth, params, response }: HttpContext) {
        let cloudinaryResponse: CloudinaryResponse | null = null
        const user = auth.user as User
        request.multipart.onFile(
            'image',
            {
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            },
            async (part, reporter) => {
                part.pause()
                part.on('data', reporter)
                const uploadResponse = await this.cloudinaryService.uploadImage(part, 'products')
                cloudinaryResponse = uploadResponse
            }
        )

        await request.multipart.process()
        console.log(cloudinaryResponse)
        if (cloudinaryResponse === null) return response.internalServerError()
        const rawData = request.only(['name', 'description', 'price', 'status'])
        const data = await productValidator.validate(rawData)
        const result = await this.productService.store(
            { ...data, status: ProductStatus.INACTIVE },
            cloudinaryResponse,
            user.id,
            params.store_id
        )
        response.created(result)
    }

    /**
     * Show individual record
     */
    async show({ params }: HttpContext) {}

    /**
     * Edit individual record
     */
    async edit({ params }: HttpContext) {}

    /**
     * Handle form submission for the edit action
     */
    async update({ params, request, response, auth }: HttpContext) {
        const isChangeImage = request.input('isChangeImage', 'false') === 'true'
        let cloudinaryResponse: CloudinaryResponse | null = null
        const user = auth.user as User
        request.multipart.onFile(
            'image',
            {
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            },
            async (part, reporter) => {
                part.pause()
                part.on('data', reporter)
                if (isChangeImage) {
                    const uploadResponse = await this.cloudinaryService.uploadImage(
                        part,
                        'products'
                    )
                    cloudinaryResponse = uploadResponse
                }
            }
        )
        await request.multipart.process()
        const rawData = request.only(['name', 'description', 'price', 'status'])
        const data = await updateProductValidator.validate(rawData)
        const result = await this.productService.update(
            { ...data },
            cloudinaryResponse,
            user.id,
            params.store_id,
            params.id
        )
        response.created(result)
    }

    /**
     * Delete record
     */
    async destroy({ params }: HttpContext) {}
}
