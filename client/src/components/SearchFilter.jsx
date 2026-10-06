import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { customDebounce } from '../utils/debounce';

const SearchFilter = (props) => {

    const {
        register,
        watch,
        resetField
    } = useForm();



    // This guarantees 'let timer' is never destroyed or reset by re-renders.
    const debouncedSearchRef = useRef(null);

    if (!debouncedSearchRef.current) {
        debouncedSearchRef.current = customDebounce((val) => { props.updateSearchParam(val, props.paramKey) }, 600);
    }

    // 3. Watch the React Hook Form input value
    const currentInput = watch('search');
    const paramValue = props.filterParams.get(props.paramKey);

    // 4. Trigger the debounced search every time the user types a character
    useEffect(() => {
        debouncedSearchRef.current(currentInput);
    }, [currentInput]);

    useEffect(() => {
        if(!paramValue) {
            resetField('search', { defaultValue: ''})
        }
    }, [resetField, paramValue]);


    return (
        <form className={`justify-center w-full flex pb-0.5`} autoComplete='off' role="search">

            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none w-full">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" ><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    name="search"
                    className="text-gray-200 w-full bg-gray-800 border-gray-600 rounded-lg ps-10 px-5 py-1.5 focus:ring-blue-500 focus:outline-none focus:ring-1 hover:ring-blue-400 hover:outline-none hover:ring-1"
                    placeholder="Search"
                    {...register('search')}
                />

            </div>

        </form>

    )
}

export default SearchFilter