import { getProduct } from '@/services/product';
import { addItemCart } from '@/services/user';
import { Icart } from '@/types/cart';
import { IProduct } from '@/types/product';
import { cartStore } from '@/zustand/my-cart';
import { userStore } from '@/zustand/user';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Col, Image, message, Row, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const DetailProduct = () => {
    const { user } = userStore();
    const { cart, setCart } = cartStore();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [product, setProduct] = useState<IProduct>();
    const [loadingCart, setLoadingCart] = useState<boolean>(false);

    const addCartHandler = async (productId: number) => {
        try {
            setLoadingCart(true);
            const response = await addItemCart({ productId }, user.user.id);
            if (!response.data.result) {
                throw new Error('Add to cart failed');
            }
            setCart(response.data.data?.cart as Icart);
            message.success('Add to cart successfully');
        } catch (error) {
            message.error((error as any).message);
        } finally {
            setLoadingCart(false);
        }
    };

    const fetchProduct = async (storeId: string, id: string) => {
        try {
            setLoading(true);
            const response = await getProduct(storeId, id);
            if (response.data.result) setProduct(response.data?.data?.product);
        } catch (error) {
            //console.log('fetchProduct -> error', error);
            message.error('Fetch product failed !');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storeId = searchParams.get('storeId');
        if (user.user.id && storeId && id) fetchProduct(storeId, id);
    }, [id, user]);

    return (
        <Row
            gutter={24}
            justify={'center'}
            style={{
                padding: '0px 48px 24px',
                backgroundColor: '#fff',
            }}
        >
            {!loading && (
                <>
                    <Col xs={24} sm={10} style={{ background: '#fff' }}>
                        <Image
                            src={product?.image.url}
                            alt={product?.name}
                            width={450}
                            height={450}
                            style={{
                                borderRadius: 10,
                                objectFit: 'cover',
                                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                                border: '4px solid #f0f0f0',
                            }}
                        />
                    </Col>
                    <Col
                        xs={24}
                        sm={14}
                        style={{
                            background: '#fff',
                        }}
                    >
                        <Typography.Title level={2}>{product?.name}</Typography.Title>
                        <Typography.Paragraph>{product?.description}</Typography.Paragraph>
                        <Typography.Title level={4}>Price: $ {product?.price}</Typography.Title>
                        <Button
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            style={{ marginTop: 12 }}
                            type="primary"
                            loading={loadingCart}
                            onClick={() => addCartHandler(product?.id as number)}
                            disabled={cart.items.some((item) => item.productId === product?.id)}
                        >
                            Add to card
                        </Button>
                    </Col>
                </>
            )}
            {loading && <Spin size="large" />}
        </Row>
    );
};

export default DetailProduct;
