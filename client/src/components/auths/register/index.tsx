import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { login, register } from '@/services/auth';

type FieldType = {
    username: string;
    email: string;
    password: string;
};

const Register: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        try {
            setLoading(true);
            const response = await register({ ...values });
            console.log(response.data);
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
            <Typography.Title level={1}>Register</Typography.Title>
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
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 4, message: 'Username must be at least 4 characters!' },
                    ]}
                >
                    <Input />
                </Form.Item>

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
                    <Button type="primary" htmlType="submit" size="large">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Link
                to={{
                    pathname: '/auth/login',
                }}
                style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 120,
                }}
            >
                <Button type="link" size="small" loading={loading}>
                    Already have an account? Login
                </Button>
            </Link>
        </>
    );
};

export default Register;
