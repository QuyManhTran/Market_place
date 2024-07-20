import { Layout } from 'antd';
import React from 'react';
import HomeHeader from './header';
import HomeFooter from './footer';
import { Outlet } from 'react-router-dom';

const layoutStyle: React.CSSProperties = {
    overflow: 'hidden',
    width: '100vw',
    maxWidth: '100vw',
};

const HomeLayout = () => {
    return (
        <Layout style={layoutStyle}>
            <HomeHeader />
            <div style={{ paddingTop: 120, backgroundColor: '#fff' }}></div>
            <Outlet />
            {/* <HomeFooter /> */}
        </Layout>
    );
};

export default HomeLayout;
