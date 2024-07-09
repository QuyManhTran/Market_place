import { store } from '@/redux/store';
import axios from 'axios';

const request = axios.create({
    baseURL:
        `${process.env.REACT_APP_HOST}/api/${process.env.REACT_APP_API_VERSION}` ||
        'http://localhost:3333/api/v1',
});

axios.interceptors.request.use(function (config) {
    const token = store.getState().user.accessToken.token;
    config.headers.Authorization = token;
    return config;
});

export default request;
