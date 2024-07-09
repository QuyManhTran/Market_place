import Login from '@/components/auths/login';
import Register from '@/components/auths/register';
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
    ]);
    return routes;
};

export default AppRouter;
