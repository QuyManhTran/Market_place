import { Colors } from '@/constants/color';
import { Avatar, Button, Dropdown, Flex, Image, List, MenuProps, message, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Input } from 'antd';
import logo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';
import {
    LogoutOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IProduct } from '@/types/product';
import { searchProduct } from '@/services/product';
import { useStore } from 'zustand';
import { userStore } from '@/zustand/user';
import { logout } from '@/services/auth';

const { Search } = Input;

const headerStyle: React.CSSProperties = {
    height: 100,
    paddingInline: 48,
    backgroundColor: Colors.PRIMARY,
    padding: '0 48px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 120,
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
};

const items: MenuProps['items'] = [
    {
        key: 'profile',
        label: (
            <Link
                to={{
                    pathname: '/account/profile',
                }}
            >
                My profile
            </Link>
        ),
        icon: <UserOutlined />,
    },
    {
        key: 'cart',
        label: (
            <Link
                to={{
                    pathname: '/account/cart',
                }}
            >
                My cart
            </Link>
        ),
        icon: <ShoppingCartOutlined />,
    },
    {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
    },
];

const HomeHeader = () => {
    const { user } = userStore();
    const [keyword, setKeyword] = useState<string>('');
    const [products, setProducts] = useState<IProduct[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await searchProduct({ cur_page: 1, per_page: 5 }, keyword);
            if (response.data.result && response.data?.data) {
                console.log(
                    'fetchProducts -> response.data.data.products.data',
                    response.data.data.products.data,
                );
                setProducts(response.data.data.products.data);
            }
        } catch (error) {
            console.log('fetchProducts -> error', error);
        }
    };

    const debouncedChangeHandler = useCallback(
        debounce((newValue) => {
            setKeyword(newValue);
        }, 500),
        [],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedChangeHandler(event.target.value);
    };

    const onLogout: MenuProps['onClick'] = async ({ key }) => {
        if (key === 'logout') {
            try {
                const reponse = await logout();
                if (reponse.data.result) {
                    message.success('Logout successfully');
                    window.location.reload();
                }
            } catch (error) {
                message.error('Logout failed');
            }
        }
    };

    useEffect(() => {
        if (!keyword) return setProducts([]);
        fetchProducts();
    }, [keyword]);

    return (
        <Header style={headerStyle}>
            <Image
                preview={false}
                src={logo}
                style={{
                    objectFit: 'cover',
                    height: 100,
                    flex: 'none',
                }}
            />
            <Flex
                align="center"
                style={{
                    position: 'relative',
                    flex: 1,
                    maxWidth: 700,
                }}
            >
                <Search
                    placeholder="Search something..."
                    enterButton={
                        <Button type="primary" icon={<SearchOutlined />}>
                            Search
                        </Button>
                    }
                    size="large"
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    type="primary"
                    onChange={(e) => handleChange(e)}
                />
                {products.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            backgroundColor: Colors.WHITE,
                            borderRadius: 8,
                            padding: '4px 8px',
                            zIndex: 1,
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            maxHeight: 300,
                            overflowY: 'auto',
                        }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={products}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image.url} />}
                                        title={<a href="https://ant.design">{item.name}</a>}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Flex>
            <Flex justify="flex-start" gap={8} align="center" style={{ flex: 'none' }}>
                {!user.user.username && (
                    <>
                        <Link
                            to={{
                                pathname: '/auth/login',
                            }}
                        >
                            <Button size="large" type="primary">
                                Login
                            </Button>
                        </Link>
                        <Link
                            to={{
                                pathname: '/auth/register',
                            }}
                        >
                            <Button size="large" type="primary">
                                Register
                            </Button>
                        </Link>
                    </>
                )}
                {user.user.username && (
                    <>
                        <Dropdown
                            menu={{
                                items: items,
                                onClick: onLogout,
                            }}
                            arrow
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <Avatar
                                    size={40}
                                    src={user.user.profile.avatar.url}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Typography.Text style={{ cursor: 'pointer', fontWeight: 600 }}>
                                    {user.user.username}
                                </Typography.Text>
                            </div>
                        </Dropdown>
                        <Link
                            to={{
                                pathname: '/account/profile',
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <img
                                width={32}
                                height={32}
                                src={'https://img.icons8.com/dusk/64/cheap-2.png'}
                                style={{ objectFit: 'cover', marginLeft: 8 }}
                                alt="balance"
                            />
                            <Typography.Text style={{ cursor: 'pointer' }}>
                                {user.user.balance}
                            </Typography.Text>
                        </Link>
                    </>
                )}
            </Flex>
        </Header>
    );
};
export default HomeHeader;
