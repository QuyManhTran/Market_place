import Cart from '@/components/account/cart';
import Order from '@/components/account/order';
import OrderDetail from '@/components/account/order/order-detail';
import Privacy from '@/components/account/privacy';
import Profile from '@/components/account/profile';
import Store from '@/components/account/store';
import Wallet from '@/components/account/wallet';
import Login from '@/components/auths/login';
import Register from '@/components/auths/register';
import AccountPage from '@/page/account';
import AuthPage from '@/page/auth';
import HomePage from '@/page/home';
import { useRoutes } from 'react-router-dom';

const AppRouter = () => {
    const routes = useRoutes([
        {
            path: '',
            element: <HomePage />,
        },
        {
            path: 'auth',
            element: <AuthPage />,
            children: [
                {
                    path: 'login',
                    element: <Login />,
                },
                {
                    path: 'register',
                    element: <Register />,
                },
            ],
        },
        {
            path: 'account',
            element: <AccountPage />,
            children: [
                {
                    path: 'profile',
                    element: <Profile />,
                },
                {
                    path: 'privacy',
                    element: <Privacy />,
                },
                {
                    path: 'wallet',
                    element: <Wallet />,
                },
                {
                    path: 'cart',
                    element: <Cart />,
                },
                {
                    path: 'order',
                    element: <Order />,
                },
                {
                    path: 'order/:id',
                    element: <OrderDetail />,
                },
                {
                    path: 'store',
                    element: <Store />,
                },
            ],
        },
    ]);
    return routes;
};

export default AppRouter;
