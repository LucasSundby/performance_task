import {mdiAccountEdit, mdiDelete} from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import React from 'react';
import {Container, create, InstanceProps} from 'react-modal-promise';
import {useDispatch, useSelector} from 'react-redux';
import Util from '../../../util';
import UserForm from '../../forms/UserForm';
import {AdminStoreState} from '../../stores/AdminStore';
import {UsersActions} from '../../stores/reducers/admin/UsersReducer';

// import '../../stylesheets/components/UserTable.css';
import '../../stylesheets/components/_Modal.css';
import Button from '../Button';
import Filter from '../Filter';
import Modal from '../Modal/Modal';
import ConfirmModal from '../modals/ConfirmModal';

export type FilterResult = {
    /**
     * The items available afrter post-processing (filter, sort, etc)
     */
    items: UserSchema[];
    /**
     * The total amount before post-processing (filter, sort, etc)
     */
    total: number;
}

const UserTable: React.FC = () => {
    const dispatch = useDispatch();

    // Fetch our districts and reduce them into a Map for presentation purposes. We only use
    // districts in this component to display a mapping from ID->Name in the table.
    const districts = useSelector((state: AdminStoreState) =>
        state.districts.districts.reduce((prev: Record<number, string>, cur: DistrictSchema) => ({...prev, [cur.id]: cur.name}), {}),
    );

    // Fetch our users from our AdminStore and apply any sorting/filtering/postprocessing that is
    // necessary.
    const users: FilterResult = useSelector((state: AdminStoreState) => {
        // obtain a copy of the current users array to avoid mutations
        let items = state.users.users.slice();
        const total: number = items.length;

        // filter users if necessary
        if (state.filter.activeOnly.enabled || state.filter.district.enabled) {
            items = items.filter((user) => {
                if (state.filter.activeOnly.enabled) {
                    if (!user.active) {
                        return false;
                    }
                }
                if (state.filter.district.enabled) {
                    if (user.district !== state.filter.district.value) {
                        return false;
                    }
                }

                return true;
            });
        }

        // sort users if necessary
        if (state.sort.enabled) {
            items = items.sort((a: UserSchema, b: UserSchema) => {
                // Swap left/right based on sort direction so that all of our switch cases can
                // operate on a single assumed state.
                const left = state.sort.direction === 'asc' ? a : b;
                const right = state.sort.direction === 'asc' ? b : a;

                switch (state.sort.column) {
                case 'id': {
                    return left.id - right.id;
                }
                case 'first_name': {
                    return left.first_name.toLowerCase().localeCompare(right.first_name.toLowerCase());
                }
                case 'last_name': {
                    return left.last_name.toLowerCase().localeCompare(right.last_name.toLowerCase());
                }
                case 'email': {
                    return left.email.toLowerCase().localeCompare(right.email.toLowerCase());
                }
                case 'verified': {
                    const _left = left.verified ? 1 : 0;
                    const _right = right.verified ? 1 : 0;

                    return _left - _right;
                }
                case 'middle_initial': {
                    const _left = left.middle_initial ? left.middle_initial : '';
                    const _right = right.middle_initial ? right.middle_initial : '';

                    return _left.toLowerCase().localeCompare(_right.toLowerCase());
                }
                case 'created_at': {
                    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
                }
                case 'district': {
                    return left.district - right.district;
                }
                case 'active': {
                    const _left = left.active ? 1 : 0;
                    const _right = right.active ? 1 : 0;

                    return _left - _right;
                }
                }

                // Return 'equal' for unhandled switch cases.
                return 0;
            });
        }

        return {
            items,
            total,
        };
    });

    const Confirmer = ({isOpen, onResolve}: InstanceProps<boolean>) => (
        <ConfirmModal show={isOpen} onComplete={onResolve}>
            <p>Are you sure you want to delete this user?</p>
            <p className="text-red-500 font-bold mb-2">This cannot be undone!</p>
        </ConfirmModal>
    );

    const Editer = ({isOpen, onResolve, user}: InstanceProps<Nullable<UserSchema>> & { user: Nullable<UserSchema> }) => (
        <Modal show={isOpen} onCloseRequest={() => onResolve(null)} aria-label="User Dialog" closeButton>
            <Modal.Header>Edit User</Modal.Header>
            <Modal.Body>
                <UserForm user={user} onComplete={onResolve}/>
            </Modal.Body>
        </Modal>
    );

    const showUserModal = async (user: Nullable<UserSchema>) => {
        const result = await create(Editer)({user: user});

        if (result != null) {
            if (result.id === -1) {
                // this is a new user. the ID will be generated upstream to circumvent issues with
                // the filter.
                dispatch(UsersActions.add(result));
            } else {
                // this is an edit of an existing user.
                dispatch(UsersActions.modify(result));
            }
        } // else: user cancelled
    };

    const handleEditUser = async (user: UserSchema) => {
        await showUserModal(user);
    };

    const handleDeleteUser = async (user: UserSchema) => {
        const deleteConfirmed = await create<InstanceProps<boolean>, boolean>(Confirmer)();

        if (deleteConfirmed) {
            dispatch(UsersActions.remove(user));
        } // else: user cancelled
    };

    const handleAddUser = async () => {
        await showUserModal(null);
    };

    return (
        <>
            <Container/>
            <div className="flex flex-row mx-auto py-2" style={{maxWidth: '90vw'}}>
                <div className="bg-purple-100 border border-purple-200 shadow rounded-md px-3 py-1">
                    <p className="text-xl text-center mb-2">Filter</p>
                    <Filter/>
                </div>
                <div className="bg-purple-100 border border-purple-200 shadow rounded-md px-3 py-1 ml-1 flex-grow">
                    <p className="text-xl text-center mb-2">Actions</p>
                    <Button type="button" variant="indigo" onClick={handleAddUser} block>Add User</Button>
                </div>
            </div>
            <div className="mx-auto py-2" style={{maxWidth: '90vw'}}>
                <h3 className="text-2xl text-center font-bold underline my-0">Users</h3>
                <p className="text-center text-gray-500 mb-1">Displaying {users.items.length} of {users.total} entries.</p>
                <table className="mx-auto w-full border border-purple-200">
                    <thead className="bg-purple-200 text-gray-800">
                        <tr>
                            <th className="px-2 py-1">ID</th>
                            <th className="px-2 py-1 hidden sm:table-cell">LName</th>
                            <th className="px-2 py-1 hidden sm:table-cell">FName</th>
                            <th className="px-2 py-1 sm:hidden">Name</th>
                            <th className="px-2 py-1 hidden md:table-cell">M.I</th>
                            <th className="px-2 py-1">District</th>
                            <th className="px-2 py-1 hidden sm:table-cell">Verified</th>
                            <th className="px-2 py-1 hidden sm:table-cell">Active</th>
                            <th className="px-2 py-1">Created</th>
                            <th className="px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-purple-50">
                        {/* Map users into rows, attach a different background to odd entries to provide a "striped" effect */}
                        {users.items.map((user: UserSchema, i: number) => (
                            <tr key={user.id} className={clsx(i % 2 !== 0 && 'bg-purple-100', 'hover:bg-purple-200 cursor-default')}>
                                <td className="px-2 py-1">{user.id}</td>
                                <td className="px-2 py-1 hidden sm:table-cell">{user.last_name}</td>
                                <td className="px-2 py-1 hidden sm:table-cell">{user.first_name}</td>
                                <td className="px-2 py-1 sm:hidden">{`${user.last_name}, ${user.first_name}`}</td>
                                <td className="px-2 py-1 hidden md:table-cell">{user.middle_initial || '-'}</td>
                                <td className="px-2 py-1">{districts[user.district]}</td>
                                <td className="px-2 py-1 hidden sm:table-cell">{user.verified ? 'Y' : 'N'}</td>
                                <td className="px-2 py-1 hidden sm:table-cell">{user.active ? 'Y' : 'N'}</td>
                                <td className="px-2 py-1">{Util.formatDate(new Date(user.created_at))}</td>
                                <td className="px-2 py-1 text-center">
                                    {/* wrapping these in divs allows us to attach onClick and set aria roles */}
                                    <div className="inline-block p-0 m-0 mr-1" onClick={() => handleEditUser(user)} role="button" aria-label="Edit User" title="Edit User">
                                        <Icon path={mdiAccountEdit} size="1.25rem" className="cursor-pointer hover:text-gray-600" aria-hidden={true}/>
                                    </div>
                                    <div className="inline-block p-0 m-0" onClick={() => handleDeleteUser(user)} role="button" aria-label="Delete User" title="Delete User">
                                        <Icon path={mdiDelete} size="1.25rem" className="cursor-pointer text-red-500 hover:text-red-600" aria-hidden={true}/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserTable;
