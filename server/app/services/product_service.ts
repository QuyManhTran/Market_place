import Store from '#models/store'
import { CloudinaryResponse } from '#types/cloudinary'
import { CreateProduct } from '#types/product'

export default class ProductService {
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
}
