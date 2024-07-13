import { Colors } from '@/constants/color';
import { Typography } from 'antd';
import { Footer } from 'antd/es/layout/layout';
const footerStyle: React.CSSProperties = {
    backgroundColor: Colors.PRIMARY,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'black',
    padding: '12px 48px',
    height: 100,
};
const HomeFooter = () => {
    return (
        <Footer style={footerStyle}>
            <Typography.Text>© 2024</Typography.Text>
            <Typography.Link>About us</Typography.Link>
            <Typography.Link>Privacy</Typography.Link>
            <Typography.Link>Terms</Typography.Link>
        </Footer>
    );
};
export default HomeFooter;
