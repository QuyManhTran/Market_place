import { Layout } from 'antd';
import React from 'react';
import HomeHeader from './header';
import HomeContent from './content';
import HomeFooter from './footer';

const layoutStyle: React.CSSProperties = {
    overflow: 'hidden',
    width: '100vw',
    maxWidth: '100vw',
};

const HomeLayout = () => {
    return (
        <Layout style={layoutStyle}>
            <HomeHeader />
            <HomeContent />
            <HomeFooter />
        </Layout>
    );
};

export default HomeLayout;
