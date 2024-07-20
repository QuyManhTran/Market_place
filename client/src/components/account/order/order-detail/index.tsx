import { Colors } from '@/constants/color';
import { PaymentStatus } from '@/enums/order';
import { getOrderDetail } from '@/services/order';
import { IOrderDetail } from '@/types/order';
import { userStore } from '@/zustand/user';
import { Button, Flex, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MyProduct from '@/components/product';
import { ArrowLeftOutlined } from '@ant-design/icons';
export const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = userStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<IOrderDetail>();
    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetail(user.user.id, Number(id));
            if (response.data.result) {
                setData(response.data.data?.order);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user.user.id) {
            fetchOrderDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    return (
        <Flex
            style={{ flex: 1, maxHeight: '100%', overflowY: 'hidden', gap: 24 }}
            vertical
            align="center"
        >
            {loading && <Spin size="large" />}
            {!loading && data && (
                <>
                    <Link
                        to={{
                            pathname: '/account/order',
                        }}
                        style={{
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Button iconPosition="start" icon={<ArrowLeftOutlined />} type="primary">
                            Back
                        </Button>
                    </Link>
                    <Flex gap={64} style={{ width: '100%' }} justify="flex-start">
                        <Flex gap={12} justify="flex-start">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Order Id:{' '}
                            </Typography.Title>
                            <Typography.Title
                                level={4}
                                style={{ margin: 0, color: `${Colors.GREEN}` }}
                            >
                                {data.id}
                            </Typography.Title>
                        </Flex>
                        <Flex gap={12} justify="flex-start">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Total:{' '}
                            </Typography.Title>
                            <Typography.Title
                                level={4}
                                style={{ margin: 0, color: `${Colors.GREEN}` }}
                            >
                                {data.total}
                            </Typography.Title>
                        </Flex>
                        <Flex gap={12} justify="flex-start">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Amount:{' '}
                            </Typography.Title>
                            <Typography.Title
                                level={4}
                                style={{ margin: 0, color: `${Colors.GREEN}` }}
                            >
                                $ {data.payment.amount}
                            </Typography.Title>
                        </Flex>
                        <Flex gap={12} justify="flex-start">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Date:{' '}
                            </Typography.Title>
                            <Typography.Title
                                level={4}
                                style={{ margin: 0, color: `${Colors.GREEN}` }}
                            >
                                $ {new Date(data.createdAt).toLocaleString()}
                            </Typography.Title>
                        </Flex>
                        <Flex gap={12} justify="flex-start" align="center">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Status:{' '}
                            </Typography.Title>
                            <Tag
                                color={
                                    data.payment.status === PaymentStatus.SUCCESS ? 'green' : 'red'
                                }
                            >
                                {data.payment.status === PaymentStatus.SUCCESS
                                    ? 'Success'
                                    : 'Failed'}
                            </Tag>
                        </Flex>
                    </Flex>
                    <Flex
                        style={{ width: '100%', overflowY: 'auto', maxHeight: '100%' }}
                        vertical
                        gap={12}
                    >
                        {data.items.map((item, index) => (
                            <MyProduct key={index} item={item} />
                        ))}
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default OrderDetail;
