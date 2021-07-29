import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

type DistrictsState = {
    districts: DistrictSchema[]
};

const initialState: DistrictsState = {
    districts: [],
};

export const reloadDistricts = createAsyncThunk(
    'districts/reloadStatus',
    async () => {
        return await fetch('/districts.json').then(res => res.json());
    }
);

const districtSlice = createSlice({
    name: 'districts',
    initialState,
    reducers: {
        add(state: DistrictsState, action: PayloadAction<DistrictSchema>) {
            state.districts.push(action.payload);
        },
        remove(state: DistrictsState, action: PayloadAction<DistrictSchema>) {
            state.districts = state.districts.filter(x => x.id !== action.payload.id);
        },
        set(state: DistrictsState, action: PayloadAction<DistrictSchema[]>) {
            state.districts = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(reloadDistricts.fulfilled, (state: DistrictsState, action: PayloadAction<DistrictSchema[]>) => {
            state.districts = action.payload;
        });
    }
});

export const DistrictsActions = districtSlice.actions;
export const DistrictsReducer = districtSlice.reducer;

export default DistrictsReducer;
