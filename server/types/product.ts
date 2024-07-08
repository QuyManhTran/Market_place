import { ProductStatus } from '#enums/product'

export interface CreateProduct {
    name: string
    description: string
    price: number
    status: ProductStatus
}
