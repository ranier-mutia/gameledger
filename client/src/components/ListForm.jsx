import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useUserContext } from '../hooks/UserContext.jsx'
import axios from 'axios';

const ListForm = (props) => {

    const [favoriteData, setFavoriteData] = useState(props.favoriteData);
    const [isLoading, setIsLoading] = useState({
        setFavorite: false,
        delete: false,

    });

    const controllerRef = useRef();

    const user = useUserContext();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            status: props.listData.status != null ? props.listData.status : "",
            score: props.listData.score != null ? props.listData.score : "",
            dateStart: props.listData.start_date != null ? props.listData.start_date : "",
            dateEnd: props.listData.end_date != null ? props.listData.end_date : "",
        }
    });

    const onHeartClickHandler = async () => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const id = favoriteData.id ? favoriteData.id : "";

        setIsLoading((prev) => ({ ...prev, setFavorite: true }));

        await axios.post('http://localhost:3000/preferences/setFavorite', { id: id, email: user.email, gameID: props.gameID }, { signal })
            .then((response) => {
                setFavoriteData(response.data);
                if (props.updateData) {
                    props.updateData();
                }
                setIsLoading((prev) => ({ ...prev, setFavorite: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });


    }

    const onDeleteClickHandler = async () => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const id = props.listData.id;

        setIsLoading((prev) => ({ ...prev, delete: true }));

        await axios.post('http://localhost:3000/lists/deleteListData', { id }, { signal })
            .then((response) => {
                if (props.updateData) {
                    props.updateData();
                }
                props.onListCloseHandler();
                setIsLoading((prev) => ({ ...prev, delete: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    const onSubmit = async (data) => {

        const formData = {
            id: props.listData.id ? props.listData.id : "",
            gameID: props.gameID,
            email: user.email,
            status: data.status,
            score: data.score ? data.score : null,
            dateStart: data.dateStart ? data.dateStart : null,
            dateEnd: data.dateEnd ? data.dateEnd : null,
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        await axios.post('http://localhost:3000/lists/updateListData', formData, { signal })
            .then((response) => {
                if (props.updateData) {
                    props.updateData();
                }
                props.onListCloseHandler();
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    return (
        <form className='w-full h-full' onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className='flex justify-end mx-10 mt-4'>
                <button type='button' onClick={onHeartClickHandler} disabled={isLoading.setFavorite}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteData ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-6 h-6 text-red-400 ${isLoading.setFavorite && 'animate-pulse'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>

            </div>

            <div className='grid sm:grid-cols-2 gap-3 mx-10 text-gray-200'>

                <div className='space-y-2'>
                    <label className='text-slate-300 text-sm'>Status</label>
                    <select className={`bg-gray-700 w-full ${watch("status") != "" ? 'text-gray-200' : 'text-gray-400'} rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.status ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
                        name="status"
                        id="status"
                        placeholder='Status'
                        {...register("status", {
                            validate: (value) => {
                                if (value == "") {
                                    return "Please set a status"
                                }
                            }
                        })}
                    >
                        {watch("status") ? '' : <option value="">None</option>}
                        <option value="plan">Plan to play</option>
                        <option value="playing">Playing</option>
                        <option value="played">Played</option>
                    </select>
                    {errors.status && <span className='text-red-400 text-xs'>{errors.status.message}</span>}
                </div>

                <div className='space-y-2'>
                    <label className='text-slate-300 text-sm'>Score</label>
                    <input className={`bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.score ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
                        type="number"
                        name="score"
                        id="score"
                        placeholder='0-100'
                        {...register("score", {
                            validate: {
                                number: v => {
                                    if (v != "") {
                                        if (!/^([0-9]|[1-9][0-9]|100)$/.test(v)) {
                                            return "Score should be a number between 0-100"
                                        }
                                    }
                                }
                            }
                        })}
                    />
                    {errors.score && <span className='text-red-400 text-xs'>{errors.score.message}</span>}
                </div>

                <div className='space-y-2'>
                    <label className='text-slate-300 text-sm'>Date Started</label>
                    <input className={`bg-gray-700 w-full focus:text-gray-200 ${watch("dateStart") ? 'text-gray-200' : 'text-gray-400'} rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.dateStart ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
                        type="date"
                        name="dateStart"
                        id="dateStart"
                        {...register("dateStart")}
                    />
                    {errors.dateStart && <span className='text-red-400 text-xs'>{errors.dateStart.message}</span>}
                </div>

                <div className='space-y-2'>
                    <label className='text-slate-300 text-sm'>Date Ended</label>
                    <input className={`bg-gray-700 w-full focus:text-gray-200 ${watch("dateEnd") ? 'text-gray-200' : 'text-gray-400'} rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.dateEnd ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
                        type="date"
                        name="dateEnd"
                        id="dateEnd"
                        {...register("dateEnd")}
                    />
                    {errors.dateEnd && <span className='text-red-400 text-xs'>{errors.dateEnd.message}</span>}
                </div>
            </div>

            <div className='flex justify-end mx-10 my-6 space-x-2'>
                {props.listData.id &&
                    <button type="button" className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 py-1 px-3 font-medium rounded-md text-slate-200 text-nowrap" disabled={isSubmitting || isLoading.delete} onClick={onDeleteClickHandler}>
                        {isLoading.delete ?
                            <svg aria-hidden="true" className="w-5 h-5 mx-3 text-gray-200 animate-spin fill-red-400 hover:fill-red-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            : 'Delete'
                        }
                    </button>
                }
                <button type='submit' className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 py-1 px-3 font-medium rounded-md text-slate-200 text-nowrap" disabled={isSubmitting}>
                    {isSubmitting ?
                        <svg aria-hidden="true" className="w-5 h-5 mx-2 text-gray-200 animate-spin fill-blue-500 hover:fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        : 'Save'
                    }

                </button>
            </div>

        </form>
    )
}

export default ListForm

