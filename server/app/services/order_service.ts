import { PaymentStatus } from '#enums/order'
import { ProductStatus } from '#enums/product'
import Order from '#models/order'
import Product from '#models/product'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'

export default class OrderService {
    async index(user: User) {
        const orders = await user
            .related('orders')
            .query()
            .preload('items', (builder) => {
                builder.preload('product', (productBuilder) => {
                    productBuilder.preload('image')
                    productBuilder.preload('store')
                })
            })
            .preload('payment')
        return {
            result: true,
            data: {
                orders,
            },
        }
    }

    async show(orderId: number) {
        const order = await Order.query()
            .where('id', orderId)
            .preload('items', (builder) => {
                builder.preload('product', (productBuilder) => {
                    productBuilder.preload('image')
                    productBuilder.preload('store')
                })
            })
            .preload('payment')
            .first()
        return {
            result: true,
            data: {
                order,
            },
        }
    }

    async store(user: User) {
        const cart = await user.related('cart').query().first()
        if (!cart) {
            throw new Exception('Cart is empty', {
                status: 400,
                code: 'E_CART_EMPTY',
            })
        }
        const cartItems = await cart
            .related('items')
            .query()
            .withAggregate('product', (builder) => {
                builder.sum('price').as('total')
            })
        const price = cartItems.reduce((acc, item) => acc + item.$extras.total, 0)
        if (!cartItems.length)
            throw new Exception('Cart is empty', {
                status: 400,
                code: 'E_CART_EMPTY',
            })
        if (price > user.balance)
            throw new Exception('Insufficient balance', {
                status: 400,
                code: 'E_INSUFFICIENT_BALANCE',
            })
        const order = await user.related('orders').create({
            total: cartItems.length,
        })
        await order.related('items').createMany(
            cartItems.map((item) => ({
                productId: item.productId,
            }))
        )
        await cart.merge({ total: 0 }).save()
        await user.merge({ balance: user.balance - price }).save()
        await order.related('payment').create({
            amount: price,
            status: PaymentStatus.SUCCESS,
        })
        await Product.query()
            .whereIn(
                'id',
                cartItems.map((item) => item.productId)
            )
            .update({ status: ProductStatus.SOLD })
        await cart.related('items').query().delete()
        await order.load((loader) => {
            loader.load('items', (builder) => {
                builder.preload('product', (productBuilder) => {
                    productBuilder.preload('image')
                })
            })
            loader.preload('payment')
        })
        return {
            result: true,
            data: {
                order,
            },
        }
    }
}
