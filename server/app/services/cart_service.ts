import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import User from '#models/user'

export default class CartService {
    async getCart(cart: Cart) {
        const cartItems = await cart
            .related('items')
            .query()
            .withAggregate('product', (builder) => {
                builder.sum('price').as('total')
            })
        const price = cartItems.reduce((acc, item) => acc + item.$extras.total, 0)
        await cart.load('items', (cartBuilder) => {
            cartBuilder.preload('product', (builder) => {
                builder.preload('image')
                builder.preload('store')
            })
        })

        return {
            result: true,
            data: {
                cart: { ...cart.serialize(), price },
            },
        }
    }

    async index(userId: number) {
        const cart = await Cart.findByOrFail('userId', userId)
        return this.getCart(cart)
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
        return this.getCart(cart)
    }

    async destroy(cartId: number, id: number) {
        const cart = await Cart.findOrFail(cartId)
        await cart
            .merge({
                total: cart.total - 1,
            })
            .save()

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
