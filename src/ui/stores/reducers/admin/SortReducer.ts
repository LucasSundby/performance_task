import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type SortColumn = keyof UserSchema;
export type SortDirection = 'asc' | 'desc';

type SortState = {
    enabled: boolean;
    column: SortColumn;
    direction: SortDirection;
};

const initialState: SortState = {
    enabled: false,
    column: 'id',
    direction: 'asc',
};

const sortSlice = createSlice({
    name: 'sorts',
    initialState,
    reducers: {
        sort(state: SortState, action: PayloadAction<Partial<SortState>>) {
            return {
                ...state,
                ...action.payload,
            };
        },
        reset() {
            return initialState;
        },
    },
});

export const SortActions = sortSlice.actions;
export const SortReducer = sortSlice.reducer;

export default SortReducer;
