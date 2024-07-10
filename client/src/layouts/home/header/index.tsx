import { Colors } from '@/constants/color';
import { Avatar, Button, Flex, Image, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Input } from 'antd';
import logo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';

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
};
const HomeHeader = () => {
    const user = useSelector((state: RootState) => state.user);

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
                    maxWidth: 700,
                }}
                type="primary"
            />
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
                        <Typography.Text style={{ cursor: 'pointer' }}>
                            {user.user.username}
                        </Typography.Text>
                    </>
                )}
            </Flex>
        </Header>
    );
};
export default HomeHeader;
