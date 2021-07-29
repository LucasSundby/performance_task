import {configureStore} from '@reduxjs/toolkit';
import * as React from 'react';
import {Provider} from 'react-redux';
import DistrictsReducer from './reducers/admin/DistrictsReducer';
import FilterReducer from './reducers/admin/FilterReducer';
import SortReducer from './reducers/admin/SortReducer';
import UsersReducer from './reducers/admin/UsersReducer';

const AdminStore = configureStore({
    reducer: {
        users: UsersReducer,
        districts: DistrictsReducer,
        filter: FilterReducer,
        sort: SortReducer,
    },
});

type AdminStoreProviderProps = {
    children: React.ReactNode;
};

export const AdminStoreProvider: React.FC<AdminStoreProviderProps> = ({children}: AdminStoreProviderProps) => {
    return (
        <Provider store={AdminStore}>
            {children}
        </Provider>
    );
};

export type AdminStoreState = ReturnType<typeof AdminStore.getState>;
export type AdminStoreDispatch = typeof AdminStore.dispatch;

export default AdminStore;
