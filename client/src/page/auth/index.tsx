import { Colors } from '@/constants/color';
import { Flex, Image } from 'antd';
import shop from '@/assets/images/cart.png';
import { Outlet } from 'react-router-dom';
const AuthPage = () => {
    return (
        <Flex gap={24} style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Flex
                align="center"
                justify="center"
                style={{
                    flexBasis: '50%',
                    flexDirection: 'column',
                }}
            >
                <Outlet />
            </Flex>

            <div
                style={{
                    backgroundColor: Colors.PRIMARY,
                    flex: 1,
                    position: 'relative',
                }}
            >
                <Image
                    width={400}
                    height={400}
                    src={shop}
                    style={{
                        position: 'absolute',
                        top: '60%',
                        left: '50%',
                        objectFit: 'contain',
                        // transform: 'translate(-50%, 0%)',
                    }}
                    preview={false}
                />
            </div>
        </Flex>
    );
};
export default AuthPage;
