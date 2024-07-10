import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { freshUser } from './slices/user';

export interface IAppProvider {
    children: React.ReactNode;
}
const AppProvider = ({ children }: IAppProvider) => {
    const user = store.getState().user;

    useEffect(() => {
        if (!user.accessToken.token) store.dispatch(freshUser());
    }, [user]);

    return <Provider store={store}>{children}</Provider>;
};

export default AppProvider;
