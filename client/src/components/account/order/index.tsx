import { PaymentStatus } from '@/enums/order';
import { getOrders } from '@/services/order';
import { IResponseOrders } from '@/types/order';
import { userStore } from '@/zustand/user';
import { Flex, Spin, Table, TableColumnsType, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface DataType {
    key: React.Key;
    id: number;
    total: number;
    amount: number;
    status: string;
    date: string;
    detail: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render(value, record, index) {
            return `$ ${value}`;
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render(value, record, index) {
            console.log('PaymentStatus', value);
            return (
                <Tag color={value === PaymentStatus.SUCCESS ? 'green' : 'red'}>
                    {value === PaymentStatus.SUCCESS ? 'Success' : 'Failed'}
                </Tag>
            );
        },
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render(value, record, index) {
            return new Date(value).toLocaleString();
        },
    },
    {
        title: 'Detail',
        dataIndex: 'detail',
        key: 'detail',

        render(value, record, index) {
            return <Link to={`/order/${record.id}`}>View detail</Link>;
        },
    },
];

const Order = () => {
    const { user } = userStore();
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders(user.user.id);
            if (!response.data.result) throw new Error(response.data.message);
            const orders = (response.data.data as IResponseOrders).orders;
            setData(
                orders.map((order) => ({
                    key: order.id,
                    id: order.id,
                    total: order.total,
                    amount: order.payment.amount,
                    status: order.payment.status,
                    date: order.createdAt,
                    detail: 'Detail',
                })),
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user.user.id) setLoading(true);
        if (user.user.id) fetchOrders();
    }, [user]);

    return (
        <>
            {!loading && (
                <Flex
                    vertical
                    style={{
                        flex: 1,
                        maxHeight: '100%',
                        overflowY: 'hidden',
                    }}
                >
                    <Typography.Title level={3}>My orders</Typography.Title>
                    <Flex
                        vertical
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                        }}
                    >
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                position: ['bottomCenter'],
                                pageSizeOptions: [5, 10, 20, 50],
                                defaultPageSize: 5,
                            }}
                        />
                    </Flex>
                </Flex>
            )}
            {loading && (
                <Flex justify="center" align="center" style={{ flex: 1 }}>
                    <Spin size="large" />
                </Flex>
            )}
        </>
    );
};
export default Order;
