import React, {useEffect} from 'react';
import UserTable from '../components/UserTable/UserTable';
import AdminStore, {AdminStoreProvider} from '../stores/AdminStore';
import {reloadDistricts} from '../stores/reducers/admin/DistrictsReducer';
import {reloadUsers} from '../stores/reducers/admin/UsersReducer';

const AdminPanel: React.FC = () => {
    // Reload our data in the AdminPanel root so that it is available to all children in the tree.
    useEffect(function mounted() {
        AdminStore.dispatch(reloadUsers());
        AdminStore.dispatch(reloadDistricts());
    });

    return (
        <AdminStoreProvider>
            <div className="--AdminPanel">
                <UserTable/>
            </div>
        </AdminStoreProvider>
    );
};

export default AdminPanel;
