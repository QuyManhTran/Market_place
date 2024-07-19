import Product from '#models/product'
import ProductImage from '#models/product_image'
import Store from '#models/store'
import { CloudinaryResponse } from '#types/cloudinary'
import { CreateProduct } from '#types/product'
import { inject } from '@adonisjs/core'
import CloudinaryService from './cloudinary_service.js'
import { Pagination, PaginationMeta } from '#types/pagination'
import { Exception } from '@adonisjs/core/exceptions'
import { ProductStatus } from '#enums/product'
import User from '#models/user'
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
                const oldPublicId = image.publicId
                await image
                    ?.merge({
                        publicId: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                    })
                    ?.save()
                const result = await this.cloudinaryService.deleteImage(oldPublicId)
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

    async index(
        { curPage, perPage }: Pagination,
        keyword: string,
        storeId: number | undefined = undefined
    ) {
        const products = await Product.query()
            .where((query) => {
                keyword &&
                    query.where((inQuery) => {
                        inQuery
                            .where('name', 'like', `%${keyword}%`)
                            .orWhere('description', 'like', `%${keyword}%`)
                    })
            })
            .where((query) => {
                storeId
                    ? query.where('storeId', storeId)
                    : query.where('status', ProductStatus.ACTIVE)
            })
            .where('isDeleted', false)
            .orderBy('updatedAt', 'desc')
            .preload('image')
            .paginate(curPage, perPage)
        const meta: PaginationMeta = {
            total: products.getMeta().total,
            perPage: products.getMeta().perPage,
            currentPage: products.getMeta().currentPage,
            lastPage: products.getMeta().lastPage,
            firstPage: products.getMeta().firstPage,
        }
        return {
            result: true,
            data: {
                products: {
                    meta,
                    data: products.all(),
                },
            },
        }
    }

    async show(storeId: number, productId: number) {
        const product = await Product.query()
            .where({ id: productId, storeId })
            .preload('image')
            .first()
        if (!product) {
            throw new Exception('Product not found', {
                code: 'E_NOT_FOUND',
                status: 404,
            })
        }
        return {
            result: true,
            data: {
                product,
            },
        }
    }

    async create(storeId: number, pagination: Pagination) {
        return this.index(pagination, '', storeId)
    }

    async destroy(user: User, storeId: number, productId: number) {
        const store = await user.related('store').query().where('id', storeId).first()
        if (!store) {
            throw new Exception('Store not found', {
                code: 'E_NOT_FOUND',
                status: 404,
            })
        }
        const product = await Product.findByOrFail({ id: productId, storeId: store.id })
        await product.merge({ isDeleted: true }).save()
        return {
            result: true,
            message: 'Product has been deleted',
        }
    }
}
