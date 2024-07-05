import Product from '#models/product'
import ProductImage from '#models/product_image'
import Store from '#models/store'
import { CloudinaryResponse } from '#types/cloudinary'
import { CreateProduct } from '#types/product'
import { inject } from '@adonisjs/core'
import CloudinaryService from './cloudinary_service.js'
@inject()
export default class ProductService {
    constructor(protected cloudinaryService: CloudinaryService) {}
    async store(
        data: CreateProduct,
        cloudinaryResponse: CloudinaryResponse,
        userId: number,
        storeId: number
    ) {
        const store = await Store.findByOrFail({ id: storeId, sellerId: userId })
        const product = await store.related('products').create({ ...data })
        await product.related('image').create({
            publicId: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        })
        await product.load('image')
        return {
            result: true,
            data: {
                product,
            },
        }
    }

    async update(
        data: CreateProduct,
        cloudinaryResponse: CloudinaryResponse | null,
        userId: number,
        storeId: number,
        productId: number
    ) {
        const store = await Store.findByOrFail({ id: storeId, sellerId: userId })
        const product = await Product.findByOrFail({ id: productId, storeId: store.id })
        await product
            .merge({
                ...data,
            })
            .save()
        if (cloudinaryResponse) {
            const image = await ProductImage.findBy({ productId: product.id })
            if (!image) {
                console.log('not exits yet')
                await product.related('image').create({
                    publicId: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                })
            } else {
                console.log('exits')
                await image
                    ?.merge({
                        publicId: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                    })
                    ?.save()
                const result = await this.cloudinaryService.deleteImage(image.publicId)
                console.log(result)
            }
        }
        await product.load('image')
        return {
            result: true,
            data: {
                product,
            },
        }
    }
}
