import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes';

import { userStore } from './zustand/user';
import { useEffect } from 'react';
import { refresh } from './services/auth';
const App = () => {
    const { user, setUser } = userStore();

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

    useEffect(() => {
        if (!user.accessToken.token) {
            refreshToken();
        }
    }, [user]);

    return (
        <Router>
            <AppRouter />
        </Router>
    );
};

export default App;
