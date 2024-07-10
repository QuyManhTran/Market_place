import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes';
import AppProvider from './redux';
const App = () => {
    return (
        <AppProvider>
            <Router>
                <AppRouter />
            </Router>
        </AppProvider>
    );
};

export default App;
