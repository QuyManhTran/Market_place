import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <AppRouter />
            </Router>
        </Provider>
    );
};

export default App;
