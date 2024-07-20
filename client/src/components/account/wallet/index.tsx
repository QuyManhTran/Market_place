import { topUp } from '@/services/user';
import { userStore } from '@/zustand/user';
import { DollarOutlined } from '@ant-design/icons';
import { Button, Flex, Form, InputNumber, message, Modal, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';

const Wallet = () => {
    const { user, topUp: topUpStore } = userStore();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [deposit, setDeposit] = useState<number>(0);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            const response = await topUp(deposit);
            if (!response.data.result) throw Error('Top up failed !');
            message.success('Top up successfully !');
            topUpStore(response.data.data?.balance as number);
        } catch (error: any) {
            message.error(error?.response?.data?.message);
        } finally {
            setConfirmLoading(false);
            setOpen(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Flex
                vertical
                style={{
                    flex: 1,
                    maxHeight: '100%',
                    overflowY: 'hidden',
                }}
            >
                <Flex style={{ width: '100%' }} gap={48}>
                    <Flex gap={12} align="center">
                        <Typography.Title style={{ margin: 0 }} level={3}>
                            Balance:{' '}
                        </Typography.Title>
                        <Typography.Title style={{ margin: 0 }} level={3}>
                            $ {user.user.balance}
                        </Typography.Title>
                    </Flex>
                    <Button
                        type="primary"
                        size="large"
                        icon={<DollarOutlined />}
                        onClick={showModal}
                    >
                        Top up
                    </Button>
                </Flex>
            </Flex>
            <Modal
                title="Top up"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Top up"
                cancelText="Cancel"
                okButtonProps={{ disabled: deposit < 1000 }}
            >
                <Form>
                    <FormItem
                        name="deposite"
                        rules={[
                            { required: true, message: 'Please input your amount!' },
                            { type: 'number', min: 1000, message: 'Amount at least 1000$' },
                        ]}
                    >
                        <InputNumber<number>
                            placeholder="Exp: 10000"
                            min={0}
                            max={99999999}
                            controls
                            size="large"
                            style={{ width: '100%', margin: '24px 0px' }}
                            onChange={(value) => {
                                if (value !== null) setDeposit(value);
                            }}
                            variant="outlined"
                            step={1000}
                        />
                    </FormItem>
                </Form>
            </Modal>
        </>
    );
};
export default Wallet;
