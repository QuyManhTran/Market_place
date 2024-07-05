import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import User from '#models/user'

export default class CartService {
    async index(userId: number) {
        const cart = await Cart.findByOrFail('userId', userId)
        await cart.load('items', (cartBuilder) => {
            cartBuilder.withAggregate('product', (builder) => {
                builder.sum('price', 'total')
            })
            cartBuilder.preload('product', (builder) => {
                builder.preload('image')
                builder.preload('store')
            })
        })
        return {
            result: true,
            data: {
                cart: cart,
            },
        }
    }

    async store(user: User, productId: number) {
        const cart = await Cart.findByOrFail('userId', user.id)
        await Product.findOrFail(productId)
        await cart
            .merge({
                total: cart.total + 1,
            })
            .save()
        await cart.related('items').create({ productId })
        await cart.load('items', (cartItemBuilder) => {
            cartItemBuilder.preload('product', (builder) => {
                builder.sum('price', 'total')
                builder.preload('image')
                builder.preload('store')
            })
        })
        return {
            result: true,
            data: {
                cart: cart,
            },
        }
    }

    async destroy(cartId: number, id: number) {
        const cartItem = await CartItem.findByOrFail({
            id,
            cartId,
        })
        await cartItem.delete()
        return {
            result: true,
            message: 'Cart item deleted successfully',
        }
    }
}
