import {mdiCloseCircle} from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AdminStoreState} from '../stores/AdminStore';
import {FilterActions} from '../stores/reducers/admin/FilterReducer';
import {SortActions} from '../stores/reducers/admin/SortReducer';
import Button from './Button';

type UserSchemaOptionProps = {
    value: keyof UserSchema;
    children: React.ReactNode;
};
// A component that enforces correct sorting values based on `keyof UserSchema`. Its only purpose
// is type safety.
const UserSchemaOption: React.FC<UserSchemaOptionProps> = (props: UserSchemaOptionProps) => (
    <option value={props.value}>{props.children}</option>
);

const Filter: React.FC = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: AdminStoreState) => state.filter);
    const districts = useSelector((state: AdminStoreState) => state.districts.districts);
    const sorts = useSelector((state: AdminStoreState) => state.sort);

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const _id = parseInt(e.currentTarget.value);

        // -1 is our reset entry ("All")
        if (_id === -1) {
            dispatch(FilterActions.filterDistrict({enabled: false, value: 0}));
        } else {
            dispatch(FilterActions.filterDistrict({enabled: true, value: _id}));
        }
    };

    const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(FilterActions.filterActiveOnly({enabled: e.currentTarget.checked}));
    };

    const handleClear = () => {
        dispatch(FilterActions.reset());
    };

    const clearDistrict = () => {
        dispatch(FilterActions.filterDistrict({enabled: false, value: 0}));
    };

    const handleButtonClick = () => {
        dispatch(SortActions.reset());
    };

    const handleSortColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(SortActions.sort({
            enabled: true,
            // `as any` to circumvent `string` into `keyof` typing issues.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            column: e.currentTarget.value as any,
        }));
    };

    const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(SortActions.sort({
            enabled: true,
            // `as any` to circumvent `string` into `keyof` typing issues.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            direction: e.currentTarget.value as any,
        }));
    };

    return (
        <div className="flex">
            <section className="inline-block">
                <div>
                    <label htmlFor="district">Filter by District: </label>
                    <div className="flex flex-row items-center">
                        <select name="district" id="district" value={filters.district.value} onChange={handleDistrictChange} className="inline-block mb-1">
                            <option value={-1}>All</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                        {filters.district.enabled && (
                            <div role="button" aria-label="Clear Filter" onClick={clearDistrict} className="relative bottom-px ml-0.5 hover:text-gray-700 cursor-pointer">
                                <Icon path={mdiCloseCircle} size="1.5rem"/>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="activeUsers">Active Users Only: </label>
                    <input type="checkbox" name="activeUsers" id="activeUsers" checked={filters.activeOnly.enabled} onChange={handleActiveChange}/>
                </div>
                {filters.activeOnly.enabled || filters.district.enabled ? (
                    <Button variant="indigo" onClick={handleClear} className="mt-1" block>Clear Filters</Button>
                ) : null}
            </section>
            <section className="inline-block ml-2">
                <div>
                    <label htmlFor="sortColumn">Sort Column: </label>
                    <select id="sortColumn" value={sorts.column} className="block w-full mb-1" onChange={handleSortColumnChange}>
                        <UserSchemaOption value="id">ID</UserSchemaOption>
                        <UserSchemaOption value="last_name">Last Name</UserSchemaOption>
                        <UserSchemaOption value="first_name">First name</UserSchemaOption>
                        <UserSchemaOption value="middle_initial">Middle Initial</UserSchemaOption>
                        <UserSchemaOption value="district">District</UserSchemaOption>
                        <UserSchemaOption value="verified">Verified</UserSchemaOption>
                        <UserSchemaOption value="active">Active</UserSchemaOption>
                        <UserSchemaOption value="created_at">Created</UserSchemaOption>
                    </select>
                </div>
                <div>
                    <label htmlFor="sortDirection">Direction: </label>
                    <select id="sortDirection" value={sorts.direction} className="block w-full mb-1" onChange={handleSortDirectionChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                {sorts.enabled && (
                    <Button variant="indigo" onClick={handleButtonClick} className="mt-1" block>Clear Sort</Button>
                )}
            </section>
        </div>
    );
};

export default Filter;
