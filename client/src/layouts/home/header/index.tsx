import { Colors } from '@/constants/color';
import {
    Avatar,
    Button,
    Dropdown,
    Flex,
    Form,
    Image,
    List,
    MenuProps,
    message,
    Modal,
    Typography,
} from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Input } from 'antd';
import logo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';
import {
    LogoutOutlined,
    PlusCircleTwoTone,
    SearchOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IProduct } from '@/types/product';
import { searchProduct } from '@/services/product';
import { userStore } from '@/zustand/user';
import { logout } from '@/services/auth';
import { menuStore } from '@/zustand/my-dashboard';
import { UserRoles } from '@/enums/user';
import { useForm } from 'antd/es/form/Form';
import { ICreateStore } from '@/types/user';
import { CreateStore } from '@/services/store';

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

const initialItems: MenuProps['items'] = [
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
    const { user, refresh, updateRole } = userStore();
    const { setSelectedKeys, refresh: refreshStore } = menuStore();
    const [keyword, setKeyword] = useState<string>('');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [items, setItems] = useState<MenuProps['items']>(initialItems);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [form] = useForm();

    useEffect(() => {
        if (user.user.id) {
            if (user.user.role === UserRoles.SELLER)
                setItems((prev) => {
                    let temp = [...initialItems];
                    temp.splice(1, 0, {
                        key: 'store',
                        label: (
                            <Link
                                to={{
                                    pathname: '/account/store',
                                }}
                            >
                                My store
                            </Link>
                        ),
                        icon: <ShopOutlined />,
                    });
                    return [...temp];
                });
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            const response = await searchProduct({ cur_page: 1, per_page: 5 }, keyword);
            if (response.data.result && response.data?.data) {
                setProducts(response.data.data.products.data);
                setIsOpenSearch(true);
            }
        } catch (error) {
            //console.log('fetchProducts -> error', error);
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
                    refresh();
                    refreshStore();
                    message.success('Logout successfully');
                    window.location.reload();
                }
            } catch (error) {
                message.error('Logout failed');
            }
        }
    };

    const onOpen = () => {
        setIsModalVisible(true);
    };

    const onClose = () => {
        setIsModalVisible(false);
    };

    const onOk = async () => {
        try {
            setLoadingForm(true);
            const values: ICreateStore = await form.validateFields();
            const response = await CreateStore(values);
            if (response.data.result) {
                message.success('Create store successfully');
                onClose();
                form.resetFields();
                updateRole(UserRoles.SELLER);
            } else {
                throw Error('Create store failed');
            }
        } catch (error) {
            //console.log('onOk -> error', error);
            message.error('Create store failed');
        } finally {
            setLoadingForm(false);
        }
    };

    useEffect(() => {
        if (!keyword) return setProducts([]);
        fetchProducts();
    }, [keyword]);

    return (
        <>
            <Header style={headerStyle}>
                <Link
                    to={{
                        pathname: '/',
                    }}
                >
                    <Image
                        preview={false}
                        src={logo}
                        style={{
                            objectFit: 'cover',
                            height: 100,
                            flex: 'none',
                        }}
                    />
                </Link>
                <Flex
                    align="center"
                    style={{
                        position: 'relative',
                        flex: 1,
                        maxWidth: 700,
                    }}
                >
                    <Search
                        onSearch={(value, e, info) => {
                            if (info?.source === 'clear') {
                                setIsOpenSearch(false);
                            }
                        }}
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
                        onFocus={() => setIsOpenSearch(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                setIsOpenSearch(false);
                            }, 200);
                        }}
                    />
                    {isOpenSearch && (
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
                                    <Link
                                        to={{
                                            pathname: `/product/${item.id}`,
                                            search: `storeId=${item.storeId}`,
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.opacity = '0.6')
                                        }
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                    >
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.image.url} />}
                                                title={<>{item.name}</>}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    </Link>
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
                            {user.user.role === UserRoles.USER && (
                                <Button
                                    size="middle"
                                    type="primary"
                                    icon={<PlusCircleTwoTone />}
                                    onClick={onOpen}
                                >
                                    Store
                                </Button>
                            )}
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
                                    pathname: '/account/wallet',
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                                onClick={() => setSelectedKeys(['wallet'])}
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
            <Modal
                open={isModalVisible}
                okText="Create"
                onCancel={onClose}
                onOk={onOk}
                confirmLoading={loadingForm}
            >
                <Typography.Title
                    style={{
                        textAlign: 'center',
                    }}
                    level={4}
                >
                    Create store
                </Typography.Title>
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item
                        label="Name"
                        name="storeName"
                        rules={[
                            { required: true, message: 'Name field must be filled!' },
                            {
                                type: 'string',
                                min: 4,
                                message: 'Name must be at least 6 characters',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: 'Description field must be filled!' },
                            {
                                type: 'string',
                                min: 4,
                                message: 'Name must be at least 6 characters',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default HomeHeader;
