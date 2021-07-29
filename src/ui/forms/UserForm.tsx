import clsx from 'clsx';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Button from '../components/Button';
import {AdminStoreState} from '../stores/AdminStore';

type FormValues = {
    firstName: string,
    middleInitial: string,
    lastName: string,
    email: string,
    active: boolean,
    district: number,
}

type ValidationErrors = Record<keyof FormValues, string>;

function isAlpha(str: string) {
    return /^[a-z]+$/i.test(str);
}

type UserFormProps = {
    user: Nullable<UserSchema>;
    onComplete: (user: Nullable<UserSchema>) => void;
};

const UserForm: React.FC<UserFormProps> = ({user, onComplete}: UserFormProps) => {
    const districts = useSelector((state: AdminStoreState) => state.districts.districts);

    // prefill our formValues with the user if provided. fallback to defaults otherwise.
    const [formValues, setFormValues] = useState<FormValues>({
        firstName: user?.first_name ?? '',
        middleInitial: user?.middle_initial ?? '',
        lastName: user?.last_name ?? '',
        email: user?.email ?? '',
        active: user?.active ?? false,
        district: user?.district ?? 0,
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
        firstName: '',
        middleInitial: '',
        lastName: '',
        email: '',
        active: '',
        district: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const errors: ValidationErrors = {...validationErrors};
        let invalid = false;

        // Handle form validation
        //  firstName is required. should be alpha
        if (formValues.firstName.trim().length == 0) {
            errors.firstName = 'This field is required.';
            invalid = true;
        } else if (!isAlpha(formValues.firstName)) {
            errors.firstName = 'Can only contain letters.';
            invalid = true;
        } else {
            errors.firstName = '';
        }

        //  middleInitial is optional. should be alpha and 1 character
        if (formValues.middleInitial.trim().length > 0) {
            if (formValues.middleInitial.length !== 1) {
                errors.middleInitial = 'Should only be one character long.';
                invalid = true;
            } else if (!isAlpha(formValues.middleInitial)) {
                errors.middleInitial = 'Can only contain letters.';
                invalid = true;
            } else {
                errors.middleInitial = '';
            }
        } else {
            errors.middleInitial = '';
        }

        //  lastName is required. should be alpha.
        if (formValues.lastName.trim().length == 0) {
            errors.lastName = 'This field is required.';
            invalid = true;
        } else if (!isAlpha(formValues.lastName)) {
            errors.lastName = 'Can only contain letters.';
            invalid = true;
        } else {
            errors.lastName = '';
        }

        //  email is required. should be a valid email.
        if (formValues.email.trim().length == 0) {
            errors.email = 'This field is required.';
            invalid = true;
        } else if (!/^[a-z0-9.]+@[a-z0-9]+(\.[a-z]{2,}){1,2}$/i.test(formValues.email)) { // super basic and not at all rfc compliant email check. should handle dots in the name and multi-level TLDs (e.g. google.co.uk).
            errors.email = 'Expected format "someone@example.com"';
            invalid = true;
        } else {
            errors.email = '';
        }

        //  district is required. should match those from /public/districts.json.
        const district = districts.filter(x => x.id === formValues.district);
        if (district == null) {
            // should never happen since we're using a select
            errors.district = 'Unknown district';
            invalid = true;
        } else {
            errors.district = '';
        }

        setValidationErrors({
            ...validationErrors,
            ...errors,
        });

        if (!invalid) {
            // Pass user back to the parent
            onComplete({
                id: user?.id ?? -1,
                first_name: formValues.firstName,
                last_name: formValues.lastName,
                email: formValues.email,
                verified: false,
                middle_initial: formValues.middleInitial || null,
                created_at: new Date().toISOString(),
                district: formValues.district,
                active: formValues.active,
            });
        }
    }

    function createTextChangeHandler(propKey: keyof FormValues) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues({
                ...formValues,
                [propKey]: e.currentTarget.value,
            });
        };
    }

    function handleActiveChanged(e: React.ChangeEvent<HTMLInputElement>) {
        setFormValues({
            ...formValues,
            active: e.currentTarget.checked,
        });
    }

    function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setFormValues({
            ...formValues,
            district: parseInt(e.currentTarget.value),
        });
    }

    return (
        <div>
            <form method="post" action="/api/users" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="txtFirstName">First Name:</label>
                    <input type="text" id="txtFirstName" name="first_name" className={clsx('block w-full', validationErrors.firstName && 'border border-red-500')} value={formValues.firstName} onChange={createTextChangeHandler('firstName')} required/>
                    {validationErrors.firstName ? (
                        <small className="block text-red-500 ml-0.5">{validationErrors.firstName}</small>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="txtLastName">Last Name:</label>
                    <input type="text" id="txtLastName" name="last_name" className={clsx('block w-full', validationErrors.lastName && 'border border-red-500')} value={formValues.lastName} onChange={createTextChangeHandler('lastName')} required/>
                    {validationErrors.lastName ? (
                        <small className="block text-red-500 ml-0.5">{validationErrors.lastName}</small>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="txtMiddleInitial">Middle Initial:</label>
                    <input type="text" id="txtMiddleInitial" name="middle_initial" className={clsx('block w-full', validationErrors.middleInitial && 'border border-red-500')} value={formValues.middleInitial} onChange={createTextChangeHandler('middleInitial')} maxLength={1}/>
                    {validationErrors.middleInitial ? (
                        <small className="block text-red-500 ml-0.5">{validationErrors.middleInitial}</small>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="txtEmail">Email:</label>
                    <input type="text" id="txtEmail" name="email" className={clsx('block w-full', validationErrors.email && 'border border-red-500')} value={formValues.email} onChange={createTextChangeHandler('email')} required/>
                    {validationErrors.email ? (
                        <small className="block text-red-500 ml-0.5">{validationErrors.email}</small>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="cbActive">Active:</label>
                    <input type="checkbox" id="cbActive" name="active" checked={formValues.active} onChange={handleActiveChanged} className="ml-1 relative bottom-px"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="selDistrict">District:</label>
                    <select id="selDistrict" name="district" value={formValues.district} className="block" onChange={handleDistrictChange}>
                        {districts.map((district) => (
                            <option key={district.id} value={district.id}>{district.name}</option>
                        ))}
                    </select>
                </div>
                <div className="text-right">
                    <Button variant="gray" type="button" onClick={() => onComplete(null)}>Cancel</Button>
                    <Button variant="blue" type="submit" className="ml-1">{user == null ? 'Create' : 'Edit'}</Button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
