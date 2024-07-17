import { ProductStatus } from '@/enums/product';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Flex, Image, TableProps, Tag } from 'antd';
import dateformat from 'dateformat';
export interface IProductStoreColumn {
    key: React.Key;
    image: string;
    name: string;
    description: string;
    price: number;
    status: string;
    date: string;
    edit: string;
}

export interface IProductStoreProps {
    openEdit: (id: number) => void;
}

const storeColumns = ({
    openEdit,
}: IProductStoreProps): TableProps<IProductStoreColumn>['columns'] => {
    const columns: TableProps<IProductStoreColumn>['columns'] = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render(value, record, index) {
                return (
                    <Image
                        key={index}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                        alt="Image"
                        fallback="Image"
                        src={value}
                    />
                );
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            rowSpan: 2,
            // ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render(value, record, index) {
                return (
                    <Tag
                        key={index}
                        color={
                            value === ProductStatus.ACTIVE
                                ? 'green'
                                : value === ProductStatus.INACTIVE
                                ? 'default'
                                : 'magenta'
                        }
                    >
                        {value === ProductStatus.ACTIVE
                            ? 'Active'
                            : value === ProductStatus.INACTIVE
                            ? 'Inactive'
                            : 'Sold'}
                    </Tag>
                );
            },
            filters: [
                {
                    text: 'Active',
                    value: ProductStatus.ACTIVE,
                },
                {
                    text: 'Inactive',
                    value: ProductStatus.INACTIVE,
                },
                {
                    text: 'Sold',
                    value: ProductStatus.SOLD,
                },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.date.localeCompare(b.date),
            render(value, record, index) {
                return dateformat(value, 'HH:MM:ss, dd/mm/yyyy');
            },
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render(value, record, index) {
                return (
                    <Flex gap={4}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultBorderColor: '#0958d9',
                                        defaultColor: '#0958d9',
                                    },
                                },
                            }}
                        >
                            <Button
                                key={index}
                                icon={<EditOutlined />}
                                color="blue"
                                onClick={() => openEdit(record.key as number)}
                            >
                                Edit
                            </Button>
                        </ConfigProvider>
                        <Button key={index} icon={<DeleteOutlined />} danger type="primary">
                            Remove
                        </Button>
                    </Flex>
                );
            },
        },
    ];
    return columns;
};

export default storeColumns;
