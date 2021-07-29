/// <reference types="react-scripts" />

// Global Helpers
type Nullable<T> = T | null;

// Schemas
type UserSchema = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    verified: boolean;
    middle_initial: Nullable<string>;
    created_at: string;
    district: number;
    active: boolean;
}

type DistrictSchema = {
    id: number;
    name: string;
    city: string;
}

// Extendable States
type FetchState<T = unknown> = {
    fetching: boolean;
    error: Nullable<string>;
    data: Nullable<T>;
}
