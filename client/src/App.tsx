import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes';

import { userStore } from './zustand/user';
import { useEffect } from 'react';
import { refresh } from './services/auth';
import { cartStore } from './zustand/my-cart';
import { getCart } from './services/user';
import { menuStore } from './zustand/my-dashboard';
import { UserRoles } from './enums/user';
const App = () => {
    const { user, setUser } = userStore();
    const { setCart } = cartStore();
    const { addStore, items } = menuStore();
    const refreshToken = async () => {
        try {
            const response = await refresh();
            if (response.data.result && response.data.data) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error('refreshToken -> error', error);
        }
    };

    const refreshCart = async (userId: number) => {
        try {
            const response = await getCart(userId);
            if (response.data.result && response.data.data) {
                setCart(response.data.data.cart);
            }
        } catch (error) {
            console.error('refreshCart -> error', error);
        }
    };

    useEffect(() => {
        if (!user.accessToken.token) refreshToken();
        else {
            refreshCart(user.user.id);
            if (user.user.role === UserRoles.SELLER && items.length === 3) {
                addStore();
            }
        }
    }, [user]);

    return (
        <Router>
            <AppRouter />
        </Router>
    );
};

export default App;
