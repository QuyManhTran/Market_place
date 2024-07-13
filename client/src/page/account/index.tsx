import React, { useState } from 'react';
import { FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Image, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('My account', 'my account', <UserOutlined />, [
        getItem('Profile', 'profile'),
        getItem('Privacy', 'privacy'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const AccountPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['profile']}
                    mode="inline"
                    items={items}
                    onSelect={({ selectedKeys }) => {
                        navigate(`/account/${selectedKeys}`);
                    }}
                    defaultOpenKeys={['my account']}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, height: 80 }}>
                    <Image
                        onClick={() => navigate('/')}
                        preview={false}
                        src={logo}
                        style={{
                            objectFit: 'cover',
                            height: 80,
                            cursor: 'pointer',
                        }}
                    />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AccountPage;
