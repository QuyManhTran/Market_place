import {
    OrderedListOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { create } from 'zustand';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
export interface IMenuStore {
    items: MenuItem[];
    selectedKeys: string[];
    addStore: () => void;
    setSelectedKeys: (keys: string[]) => void;
    refresh: () => void;
}

const initialValues: MenuItem[] = [
    getItem('My account', 'my account', <UserOutlined />, [
        getItem('Profile', 'profile'),
        getItem('Change password', 'privacy'),
        getItem('My wallet', 'wallet'),
    ]),
    getItem('My cart', 'cart', <ShoppingCartOutlined />),
    getItem('My order', 'order', <OrderedListOutlined />),
];
export const menuStore = create<IMenuStore>((set) => ({
    items: initialValues,
    selectedKeys: ['profile'],
    addStore() {
        set((state) => ({
            ...state,
            items: [...state.items, getItem('My store', 'store', <ShopOutlined />)],
        }));
    },
    setSelectedKeys(keys) {
        set({ selectedKeys: keys });
    },
    refresh() {
        set({ items: initialValues });
    },
}));
