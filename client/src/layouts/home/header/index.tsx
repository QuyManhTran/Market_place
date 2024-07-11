import { Colors } from '@/constants/color';
import { Avatar, Button, Flex, Image, List, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Input } from 'antd';
import logo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { IProduct } from '@/types/product';
import { searchProduct } from '@/services/product';

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

const HomeHeader = () => {
    const user = useSelector((state: RootState) => state.user);
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
                }}
            />
            <Flex
                align="center"
                style={{
                    position: 'relative',
                    minWidth: 700,
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
            <Flex justify="flex-start" gap={8} align="center">
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
                        <Avatar
                            size={40}
                            src={user.user.profile.avatar.url}
                            style={{ cursor: 'pointer' }}
                        />
                        <Typography.Text style={{ cursor: 'pointer', fontWeight: 600 }}>
                            {user.user.username}
                        </Typography.Text>
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
                    </>
                )}
            </Flex>
        </Header>
    );
};
export default HomeHeader;
