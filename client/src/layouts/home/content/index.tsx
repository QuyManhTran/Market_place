import ProductItem from '@/components/home/product-item';
import { searchProduct } from '@/services/product';
import { IMeta, IProduct } from '@/types/product';
import { userStore } from '@/zustand/user';
import { Flex, Pagination, PaginationProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';

const contentStyle: React.CSSProperties = {
    minHeight: 120,
    padding: '120px 0px',
};

const HomeContent = () => {
    const { user } = userStore();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [meta, setMeta] = useState<IMeta>();
    const [limit, setLimit] = useState<number>(10);
    const [cur, setCur] = useState<number>(1);

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        setLimit(pageSize);
        setCur(current);
    };

    const fetchProducts = async () => {
        try {
            const response = await searchProduct({ cur_page: cur, per_page: limit });
            if (response.data.result && response.data?.data) {
                setProducts(response.data.data.products.data);
                setMeta(response.data.data.products.meta);
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

    useEffect(() => {
        if (cur && user.accessToken.token) fetchProducts();
    }, [cur]);

    return (
        <Content style={contentStyle}>
            <Flex
                gap={24}
                wrap
                style={{
                    padding: '12px 64px',
                }}
                justify="start"
            >
                {products.length &&
                    products.map((product, index) => <ProductItem key={index} product={product} />)}
            </Flex>
            {meta && (
                <Flex justify="center">
                    <Pagination
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        onChange={onShowSizeChange}
                        defaultCurrent={cur}
                        total={meta.total}
                    />
                </Flex>
            )}
        </Content>
    );
};

export default HomeContent;
