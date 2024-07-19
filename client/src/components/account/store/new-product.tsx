import { ProductStatus } from '@/enums/product';
import { createProduct } from '@/services/store';
import { ICreateProduct, IProduct } from '@/types/product';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, message, Modal, Select, Upload } from 'antd';
import { FC, useState } from 'react';
export interface ProductFormProps {
    isModalVisible: boolean;
    storeId: number;
    onCancel: () => void;
    onCreate: (product: IProduct) => void;
}
const ProductForm: FC<ProductFormProps> = ({ isModalVisible, onCancel, storeId, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onConfirm = async () => {
        try {
            setLoading(true);
            const values: ICreateProduct = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price.toString());
            formData.append('status', values.status);
            formData.append('image', values.image[0].originFileObj);
            const response = await createProduct(formData, storeId);
            if (response.data) {
                message.success('Create product successfully !');
                onCreate(response.data.data?.product as IProduct);
                onCancel();
                form.resetFields();
            }
        } catch (error) {
            message.error('Please fill all required fields !');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal
            open={isModalVisible}
            okText="Create"
            cancelText="Cancel"
            title="New product"
            onCancel={onCancel}
            onOk={onConfirm}
            confirmLoading={loading}
        >
            <Form
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
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
                    <InputNumber width={'100%'} min={0} max={1000000} controls step={1000} />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Status required!' }]}
                >
                    <Select>
                        <Select.Option value={ProductStatus.ACTIVE}>Active</Select.Option>
                        <Select.Option value={ProductStatus.INACTIVE}>Inactive</Select.Option>
                        <Select.Option value={ProductStatus.SOLD}>Sold</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Upload"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: true,
                            message: 'Image required!',
                        },
                    ]}
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
        </Modal>
    );
};

export default ProductForm;
