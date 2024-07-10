import ProductItem from '@/components/home/product-item';
import { RootState } from '@/redux/store';
import { searchProduct } from '@/services/product';
import { IProduct } from '@/types/product';
import { Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const contentStyle: React.CSSProperties = {
    minHeight: 120,
};

const HomeContent = () => {
    const user = useSelector((state: RootState) => state.user);
    const [products, setProducts] = useState<IProduct[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await searchProduct();
            if (response.data.result && response.data?.data) {
                console.log(
                    'fetchProducts -> response.data.data.products.data',
                    response.data.data.products.data,
                );
                setProducts(response.data.data.products.data);
            }
        } catch (error) {
            console.log('fetchProducts -> error', error);
        }
    };

    useEffect(() => {
        if (user.accessToken.token) {
            fetchProducts();
        }
    }, [user]);

    return (
        <Content style={contentStyle}>
            <Flex
                gap={12}
                wrap
                style={{
                    padding: '12px 24px',
                }}
            >
                {products.length &&
                    products.map((product, index) => <ProductItem key={index} product={product} />)}
            </Flex>
        </Content>
    );
};

export default HomeContent;
