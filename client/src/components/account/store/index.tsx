import { getStoreProducts } from '@/services/product';
import { getMyStore } from '@/services/user';
import { IPagination, IProduct } from '@/types/product';
import { IMyStore } from '@/types/user';
import { userStore } from '@/zustand/user';
import { Descriptions, Flex, message, PaginationProps, Spin, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { IProductStoreColumn } from './column';
import storeColumns from './column';

const Store = () => {
    const { user } = userStore();
    const [store, setStore] = useState<IMyStore>();
    const [data, setData] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [cur, setCur] = useState<number>(1);

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        setLimit(pageSize);
        setCur(current);
    };

    const fetchStore = async () => {
        try {
            setLoading(true);
            const response = await getMyStore();
            if (response.data.result) {
                setStore(response.data.data?.store);
            }
            await fetchProducts(response.data.data?.store.id as number, {
                cur_page: cur,
                per_page: limit,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (storeId: number, pagination: IPagination) => {
        try {
            const response = await getStoreProducts(storeId, pagination);
            if (response.data.result) {
                setData(response.data.data?.products?.data as IProduct[]);
                setTotal(response.data.data?.products?.meta?.total as number);
            }
        } catch (error) {
            message.error('Oops, Something went wrong !');
        } finally {
            setLoading(false);
        }
    };

    const filterData: IProductStoreColumn[] = useMemo(() => {
        return data.map((item) => ({
            key: item.id,
            image: item.image.url,
            name: item.name,
            description: item.description,
            price: item.price,
            status: item.status,
            edit: 'Edit',
        }));
    }, [data]);

    useEffect(() => {
        if (user.user.id) fetchStore();
    }, [user]);

    useEffect(() => {
        if (total) fetchStore();
    }, [cur, limit]);

    return (
        <Flex
            vertical
            style={{
                flex: 1,
                maxHeight: '100%',
                overflowY: 'hidden',
            }}
            gap={12}
        >
            {loading && <Spin size="large" />}
            {!loading && store && (
                <>
                    <Descriptions title="My Store" bordered>
                        <Descriptions.Item label="Store Name">{store.storeName}</Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {store.description}
                        </Descriptions.Item>
                    </Descriptions>
                    <Table
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                        }}
                        columns={storeColumns({
                            openEdit: (id) => {
                                console.log({ id });
                            },
                        })}
                        dataSource={filterData}
                        pagination={{
                            total: total,
                            pageSize: limit,
                            current: cur,
                            onChange: onShowSizeChange,
                            onShowSizeChange: onShowSizeChange,
                            position: ['bottomCenter'],
                            pageSizeOptions: [5, 10, 20, 50],
                            showSizeChanger: true,
                        }}
                        showSorterTooltip={{ target: 'full-header' }}
                    />
                </>
            )}
        </Flex>
    );
};
export default Store;
