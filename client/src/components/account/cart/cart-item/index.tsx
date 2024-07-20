import MyProduct from '@/components/product';
import { removeItemCart } from '@/services/user';
import { ICartItem } from '@/types/cart';
import { message } from 'antd';
import { FC, memo, useCallback, useState } from 'react';

export interface ICartItemProps {
    item: ICartItem;
    cartId: number;
    removeItem: (itemId: number, price: number) => void;
}

const CartItem: FC<ICartItemProps> = ({ item, cartId, removeItem }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleCancel = useCallback(() => {
        console.log('Clicked cancel button');
        setOpen(false);
    }, []);
    const removeHandler = useCallback(async (itemId: number, price: number) => {
        try {
            setConfirmLoading(true);
            const response = await removeItemCart(cartId, itemId);
            if (!response.data.result) {
                throw new Error(response.data.message);
            }
            if (response.data.result) {
                removeItem(itemId, price);
                message.success(response.data.message);
            }
        } catch (error) {
            message.error((error as any).message);
        } finally {
            setConfirmLoading(false);
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);
    return (
        <MyProduct
            item={item}
            handleCancel={handleCancel}
            isDelete
            loading={confirmLoading}
            handleOpen={handleOpen}
            open={open}
            removeHandler={removeHandler}
        />
    );
};
export default memo(CartItem);
