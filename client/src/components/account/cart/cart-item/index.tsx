import { Colors } from '@/constants/color';
import { removeItemCart } from '@/services/user';
import { ICartItem } from '@/types/cart';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Image, message, Popconfirm, Typography } from 'antd';
import { FC, memo, useState } from 'react';

export interface ICartItemProps {
    item: ICartItem;
    cartId: number;
    removeItem: (itemId: number, price: number) => void;
}

const CartItem: FC<ICartItemProps> = ({ item, cartId, removeItem }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    const removeHandler = async (itemId: number, price: number) => {
        try {
            setConfirmLoading(true);
            const response = await removeItemCart(cartId, itemId);
            if (!response.data.result) {
                throw new Error(response.data.message);
            }
            if (response.data.result) {
                removeItem(itemId, price);
                message.success(response.data.message);
            }
        } catch (error) {
            message.error((error as any).message);
        } finally {
            setConfirmLoading(false);
            setOpen(false);
        }
    };
    return (
        <Flex
            align="center"
            gap={128}
            style={{
                borderTop: `1px solid ${Colors.GRAY}`,
                borderBottom: `1px solid ${Colors.GRAY}`,
                padding: '12px 0',
            }}
        >
            <Image
                src={item.product.image.url}
                alt={item.product.name}
                width={80}
                height={80}
                style={{
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: `1px solid ${Colors.BLUE}`,
                }}
            />
            <Typography.Title level={5} style={{ margin: 0, width: 128 }}>
                {item.product.name}
            </Typography.Title>
            <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, width: 240 }}>
                {item.product.name}
            </Typography.Paragraph>
            <Typography.Title level={3} style={{ margin: 0, color: Colors.BLUE, width: 80 }}>
                $ {item.product.price}
            </Typography.Title>
            <Popconfirm
                title="Delete this item"
                description="Are you sure to delete this item?"
                onConfirm={() => {
                    removeHandler(item.id, item.product.price);
                }}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ loading: confirmLoading }}
                onCancel={handleCancel}
                open={open}
            >
                <Button
                    size="middle"
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ marginLeft: 'auto' }}
                    onClick={() => setOpen(true)}
                >
                    Remove
                </Button>
            </Popconfirm>
        </Flex>
    );
};
export default memo(CartItem);
