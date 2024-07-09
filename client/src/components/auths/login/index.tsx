import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { login } from '@/services/auth';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { UserAction } from '@/redux/slices/user';

type FieldType = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const dispath: AppDispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        try {
            setLoading(true);
            const response = await login({ ...values });
            console.log(response.data);
            if (!response.data.result) throw new Error(response.data?.message);
            dispath(UserAction.setUser(response.data.data!));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
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
                <Button type="link" size="large" loading={loading}>
                    Don't have an account? Register here!
                </Button>
            </Link>
        </>
    );
};

export default Login;
