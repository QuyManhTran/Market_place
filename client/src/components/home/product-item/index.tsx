import React from 'react';
import { Card, Typography } from 'antd';
import { IProduct } from '@/types/product';

const ProductItem: React.FC<{ product: IProduct }> = ({ product }) => (
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
                rows: 2,
            }}
        >
            {product.description}
        </Typography.Paragraph>
        <Typography.Title level={3}>{product.price}$</Typography.Title>
    </Card>
);

export default ProductItem;
