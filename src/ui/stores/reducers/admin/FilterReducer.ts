import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type _Filter<T = unknown> = {
    enabled: boolean;
} & T;

type DistrictFilter = _Filter<{ value: number }>;
type ActiveOnlyFilter = _Filter;

type FilterState = {
    district: DistrictFilter;
    activeOnly: ActiveOnlyFilter;
};

const initialState: FilterState = {
    district: {
        enabled: false,
        value: -1,
    },
    activeOnly: {
        enabled: false,
    },
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filterDistrict(state: FilterState, action: PayloadAction<DistrictFilter>) {
            state.district = action.payload;
        },
        filterActiveOnly(state: FilterState, action: PayloadAction<ActiveOnlyFilter>) {
            state.activeOnly = action.payload;
        },
        reset() {
            return initialState;
        },
    },
});

export const FilterActions = filterSlice.actions;
export const FilterReducer = filterSlice.reducer;

export default FilterReducer;
