import { cartStore } from '@/zustand/my-cart';
import { Button, Flex, message, Typography } from 'antd';
import { useCallback, useState } from 'react';
import CartItem from './cart-item';
import { createOrder } from '@/services/order';
import { userStore } from '@/zustand/user';

const Cart = () => {
    const { cart, removeItem, removeCart } = cartStore();
    const { user } = userStore();
    const [loading, setLoading] = useState<boolean>(false);

    const onRemoveItem = useCallback((itemId: number, price: number) => {
        removeItem(itemId, price);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createOrderHandler = async () => {
        try {
            setLoading(true);
            const response = await createOrder(user.user.id);
            if (!response.data.result) throw new Error(response.data.message);
            message.success('Order created successfully');
            removeCart();
        } catch (error: any) {
            console.log(error?.response?.data?.message);
            message.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex
            vertical
            style={{
                padding: '12px 24px',
                flex: 1,
                overflow: 'hidden',
                maxHeight: '100%',
            }}
            justify="flex-start"
        >
            <Flex gap={64}>
                <Typography.Title style={{ margin: 0 }} level={3}>
                    Total amount:{' '}
                </Typography.Title>
                <Typography.Title style={{ margin: 0 }} level={3} type="success">
                    {cart.total}
                </Typography.Title>
                <Typography.Title style={{ margin: 0 }} level={3}>
                    Total payment:{' '}
                </Typography.Title>
                <Typography.Title style={{ margin: 0 }} level={3} type="success">
                    $ {cart.price}
                </Typography.Title>
                <Button
                    type="primary"
                    size="large"
                    style={{ marginLeft: 'auto', minWidth: 96 }}
                    disabled={cart.total === 0}
                    loading={loading}
                    onClick={createOrderHandler}
                >
                    Order
                </Button>
            </Flex>
            <Flex
                vertical
                gap={12}
                style={{
                    width: '100%',
                    marginTop: 24,
                    overflow: 'auto',
                    maxHeight: '100%',
                    paddingRight: 12,
                }}
            >
                {cart.items.map((item, index) => (
                    <CartItem key={index} cartId={cart.id} item={item} removeItem={onRemoveItem} />
                ))}
            </Flex>
        </Flex>
    );
};
export default Cart;
