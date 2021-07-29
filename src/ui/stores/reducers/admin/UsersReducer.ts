import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

type UsersState = {
    users: UserSchema[]
};

const initialState: UsersState = {
    users: [],
};

export const reloadUsers = createAsyncThunk(
    'users/reloadStatus',
    async () => {
        return await fetch('/users.json').then(res => res.json());
    },
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        add(state: UsersState, action: PayloadAction<UserSchema>) {
            // obtain a copy since we may mutate the ID
            const payload = {...action.payload};

            if (action.payload.id === -1) {
                // need to calculate an ID. use a reducer to find the largest ID and increment by
                // one. we calculate ID here to bypass any issues that arise from filtering
                // downstream.
                const largestId = state.users.reduce((prev, user) => (user.id > prev ? user.id : prev), 0);
                payload.id = largestId + 1;
            }

            state.users.push(payload);
        },
        remove(state: UsersState, action: PayloadAction<UserSchema>) {
            state.users = state.users.filter(x => x.id !== action.payload.id);
        },
        modify(state: UsersState, action: PayloadAction<UserSchema>) {
            state.users = state.users.map(x => x.id === action.payload.id ? {...action.payload} : x);
        },
        set(state: UsersState, action: PayloadAction<UserSchema[]>) {
            state.users = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(reloadUsers.fulfilled, (state: UsersState, action: PayloadAction<UserSchema[]>) => {
            state.users = action.payload;
        });
    },
});

export const UsersActions = usersSlice.actions;
export const UsersReducer = usersSlice.reducer;

export default UsersReducer;
