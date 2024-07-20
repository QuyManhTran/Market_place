import { Colors } from '@/constants/color';
import { IBaseItem } from '@/types/cart';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Popconfirm, Typography } from 'antd';
import { FC, memo } from 'react';

export interface IMyProductProps {
    item: IBaseItem;
    isDelete?: boolean;
    removeHandler?: (itemId: number, price: number) => Promise<void>;
    loading?: boolean;
    handleCancel?: () => void;
    open?: boolean;
    handleOpen?: () => void;
}

const MyProduct: FC<IMyProductProps> = ({
    item,
    isDelete = false,
    removeHandler = async () => {},
    loading = false,
    handleCancel = () => {},
    open = false,
    handleOpen = () => {},
}) => {
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
            {isDelete && (
                <Popconfirm
                    title="Delete this item"
                    description="Are you sure to delete this item?"
                    onConfirm={() => {
                        removeHandler(item.id, item.product.price);
                    }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ loading }}
                    onCancel={handleCancel}
                    open={open}
                >
                    <Button
                        size="middle"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: 'auto' }}
                        onClick={handleOpen}
                    >
                        Remove
                    </Button>
                </Popconfirm>
            )}
        </Flex>
    );
};
export default memo(MyProduct);
