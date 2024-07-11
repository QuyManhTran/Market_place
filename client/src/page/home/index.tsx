import HomeLayout from '@/layouts/home';

const HomePage = () => {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                overflowX: 'hidden',
            }}
        >
            <HomeLayout />
        </div>
    );
};

export default HomePage;
