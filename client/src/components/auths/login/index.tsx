import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Alert, Button, Form, Input, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/services/auth';
import { CheckCircleFilled } from '@ant-design/icons';
import { userStore } from '@/zustand/user';
import { IUserState } from '@/types/user';
type FieldType = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const { setUser } = userStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        try {
            setLoading(true);
            const response = await login({ ...values });
            console.log(response.data);
            if (!response.data.result) throw new Error(response.data?.message);
            setUser(response.data.data as IUserState);
            message.success('Login successfully !');
            setIsSuccess(true);
            navigate('/');
        } catch (error) {
            console.log(error);
            message.error('Login failed !');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            {isSuccess && (
                <Alert
                    message={'Login successfully !'}
                    type="success"
                    closable
                    showIcon
                    icon={<CheckCircleFilled />}
                />
            )}
            <Typography.Title level={1}>Login</Typography.Title>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: 600, gap: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please input a valid email!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        {
                            min: 4,
                            message: 'Password must be at least 4 characters!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{
                            marginLeft: 'auto',
                        }}
                        loading={loading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Link
                to={{
                    pathname: '/auth/register',
                }}
                style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 120,
                }}
            >
                <Button type="link" size="large">
                    Don't have an account? Register here!
                </Button>
            </Link>
        </>
    );
};

export default Login;
