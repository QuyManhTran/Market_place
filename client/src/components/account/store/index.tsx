import { getStoreProducts } from '@/services/product';
import { getMyStore } from '@/services/user';
import { IPagination, IProduct, IUpdateProduct } from '@/types/product';
import { IMyStore } from '@/types/user';
import { userStore } from '@/zustand/user';
import {
    Descriptions,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PaginationProps,
    Select,
    Spin,
    Table,
    Typography,
    Upload,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IProductStoreColumn } from './column';
import storeColumns from './column';
import { PlusCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { ProductStatus } from '@/enums/product';
import { removeStoreProduct, updateProduct } from '@/services/store';
import ProductForm from './new-product';
import { useLocation } from 'react-router-dom';
import { menuStore } from '@/zustand/my-dashboard';

const Store = () => {
    const { pathname } = useLocation();
    const { setSelectedKeys } = menuStore();
    const { user } = userStore();
    const [store, setStore] = useState<IMyStore>();
    const [data, setData] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [cur, setCur] = useState<number>(1);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
    const [isNewProductModal, setIsNewProductModal] = useState<boolean>(false);
    const [editProduct, setEditProduct] = useState<number>();
    const [removeProduct, setRemoveProduct] = useState<number>();
    const [isRemoveModal, setIsRemoveModal] = useState<boolean>(false);
    const [loadingRemove, setLoadingRemove] = useState<boolean>(false);
    const [form] = Form.useForm();

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

    const onCancel = () => {
        setEditProduct(undefined);
        setIsModalVisible(false);
    };

    const onOpen = (id: number) => {
        setIsModalVisible(true);
        setEditProduct(id);
    };

    const onConfirm = async () => {
        try {
            setLoadingEdit(true);
            const values: IUpdateProduct = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price.toString());
            formData.append('status', values.status);
            if (values.image) {
                formData.append('image', values.image[0].originFileObj);
            }
            const response = await updateProduct(
                formData,
                store?.id as number,
                editProduct as number,
                !!values.image,
            );
            if (response.data.result) {
                message.success('Update success !');
                setData((prev) => {
                    const index = prev.findIndex((item) => item.id === editProduct);
                    prev[index] = response.data.data?.product as IProduct;
                    return [...prev];
                });
            }
            setEditProduct(undefined);
            setIsModalVisible(false);
        } catch (error) {
            message.error('Please fill all required fields !');
        } finally {
            setLoadingEdit(false);
        }
    };

    const onCreate = useCallback((product: IProduct) => {
        setData((prev) => [product, ...prev]);
        setTotal((prev) => prev + 1);
    }, []);

    const onCancelNewProduct = useCallback(() => setIsNewProductModal(false), []);

    const filterProduct = useMemo(() => {
        if (!editProduct) return undefined;
        const product = data.find((item) => item.id === editProduct);
        return product;
    }, [editProduct]);

    const filterData: IProductStoreColumn[] = useMemo(() => {
        return data.map((item) => ({
            key: item.id,
            image: item.image.url,
            name: item.name,
            description: item.description,
            price: item.price,
            status: item.status,
            date: item.updatedAt,
            edit: 'Edit',
        }));
    }, [data]);

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onOpenRemove = useCallback((id: number) => {
        setRemoveProduct(id);
        setIsRemoveModal(true);
    }, []);

    const onCancelRemove = () => {
        setIsRemoveModal(false);
    };

    const onRemove = async () => {
        try {
            setLoadingRemove(true);
            const response = await removeStoreProduct(store?.id as number, removeProduct as number);
            if (response.data.result) {
                setData((prev) => prev.filter((item) => item.id !== removeProduct));
                setTotal((prev) => prev - 1);
                message.success('Remove successfully !');
            }
            setIsRemoveModal(false);
        } catch (error) {
            message.error('Something went wrong !');
        } finally {
            setLoadingRemove(false);
        }
    };

    useEffect(() => {
        if (user.user.id) fetchStore();
    }, [user]);

    useEffect(() => {
        if (total) fetchStore();
    }, [cur, limit]);

    useEffect(() => {
        setSelectedKeys([pathname.split('/').pop() as string]);
    }, [pathname]);

    return (
        <>
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
                            <Descriptions.Item label="Store Name">
                                {store.storeName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">
                                {store.description}
                            </Descriptions.Item>
                        </Descriptions>
                        <Flex gap={24} align="center">
                            <Typography.Title
                                style={{
                                    margin: 0,
                                }}
                                level={4}
                            >
                                Products
                            </Typography.Title>
                            <PlusCircleTwoTone
                                style={{ fontSize: 20, cursor: 'pointer' }}
                                onClick={() => setIsNewProductModal(true)}
                            />
                        </Flex>
                        <Table
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                            }}
                            columns={storeColumns({
                                openEdit: onOpen,
                                openRemove: onOpenRemove,
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
            <Modal
                open={isModalVisible}
                okText="Update"
                cancelText="Cancel"
                title="Edit"
                onCancel={onCancel}
                onOk={onConfirm}
                destroyOnClose
                confirmLoading={loadingEdit}
            >
                {editProduct && filterProduct && (
                    <Form
                        clearOnDestroy
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        style={{ maxWidth: 600 }}
                        initialValues={{
                            name: filterProduct.name,
                            description: filterProduct.description,
                            price: filterProduct.price,
                            status: filterProduct.status,
                        }}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Name required!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Descripton required!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Price required!' }]}
                        >
                            <InputNumber
                                width={'100%'}
                                min={0}
                                max={1000000}
                                controls
                                step={1000}
                            />
                        </Form.Item>
                        <Form.Item label="Status" name="status">
                            <Select>
                                <Select.Option value={ProductStatus.ACTIVE}>Active</Select.Option>
                                <Select.Option value={ProductStatus.INACTIVE}>
                                    Inactive
                                </Select.Option>
                                <Select.Option value={ProductStatus.SOLD}>Sold</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Upload"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                beforeUpload={(file) => {
                                    console.log(file);
                                    const isJpgOrPng =
                                        file.type === 'image/jpeg' || file.type === 'image/png';
                                    if (!isJpgOrPng) {
                                        message.error('You can only upload JPG/PNG file!');
                                        return false;
                                    }

                                    const isLt2M = file.size / (1024 * 1024) <= 1;
                                    if (!isLt2M) {
                                        message.error('Image must smaller than 2MB!');
                                        return false;
                                    }
                                    return false;
                                }}
                                showUploadList={true}
                                listType="picture-card"
                                multiple={false}
                                maxCount={1}
                            >
                                <button style={{ border: 0, background: 'none' }} type="button">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            </Upload>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
            <Modal
                open={isRemoveModal}
                okText="Remove"
                cancelText="Cancel"
                onCancel={onCancelRemove}
                confirmLoading={loadingRemove}
                onOk={onRemove}
            >
                <Typography.Title
                    type="danger"
                    style={{
                        textAlign: 'center',
                        padding: '24px 0',
                    }}
                    level={4}
                >
                    Are you sure to remove this product ?
                </Typography.Title>
            </Modal>
            {store && (
                <ProductForm
                    isModalVisible={isNewProductModal}
                    onCancel={onCancelNewProduct}
                    storeId={store.id}
                    onCreate={onCreate}
                />
            )}
        </>
    );
};
export default Store;
