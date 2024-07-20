import React, { MouseEvent } from 'react';
import { Button, Card, Flex, message, Typography } from 'antd';
import { IProduct } from '@/types/product';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Icart, ICartItem } from '@/types/cart';
import { addItemCart } from '@/services/user';
import { cartStore } from '@/zustand/my-cart';
import { Link } from 'react-router-dom';

const ProductItem: React.FC<{ product: IProduct; cart: ICartItem[]; userId: number }> = ({
    product,
    cart,
    userId,
}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { setCart } = cartStore();
    const addCartHandler = async (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setLoading(true);
            const response = await addItemCart({ productId: product.id }, userId);
            if (!response.data.result) {
                throw new Error('Add to cart failed');
            }
            setCart(response.data.data?.cart as Icart);
            message.success('Add to cart successfully');
        } catch (error) {
            message.error((error as any).message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Link
            to={{
                pathname: `/product/${product.id}`,
                search: `storeId=${product.storeId}`,
            }}
        >
            <Card
                style={{ width: 240 }}
                hoverable
                cover={
                    <img
                        alt="example"
                        src={product.image.url}
                        style={{
                            width: '100%',
                            height: 240,
                            objectFit: 'cover',
                        }}
                    />
                }
            >
                <Typography.Text
                    ellipsis={{
                        expanded: true,
                    }}
                    strong={true}
                    style={{
                        fontSize: 20,
                        fontWeight: 600,
                    }}
                >
                    {product.name}
                </Typography.Text>
                <Typography.Paragraph
                    style={{
                        fontSize: 12,
                    }}
                    ellipsis={{
                        expanded: false,
                        rows: 1,
                    }}
                >
                    {product.description}
                </Typography.Paragraph>
                <Flex justify="space-between" align="center" style={{ padding: '12px 0px' }}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        {product.price}$
                    </Typography.Title>
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined color="white" style={{ fontSize: 24 }} />}
                        disabled={cart.some((item) => item.productId === product.id)}
                        onClick={addCartHandler}
                        loading={loading}
                    >
                        Add
                    </Button>
                </Flex>
            </Card>
        </Link>
    );
};

export default ProductItem;
