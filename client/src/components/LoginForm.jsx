import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';

const LoginForm = (props) => {

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm();

    const validateUser = async (data) => {
        return await axios.post('http://localhost:3000/users/validateUser', { data })
            .then((response) => {
                const valid = response.data;

                if (!valid) throw new Error();

                return true;

            })
            .catch((error) => {

                if (error.response) {
                    if (error.response.data == false) {
                        setError("root", {
                            message: "Incorrect email or password"
                        })
                    } else {
                        console.log(error);
                    }
                } else {
                    console.log(error);
                }

            });
    }

    const validateEmail = async (data) => {
        return await axios.post('http://localhost:3000/users/validateEmail', { data: { ...data, type: props.type } })
            .then((response) => {
                const exists = response.data;

                if (exists) {
                    if (props.type == "signup") {
                        throw new Error();
                    } else {
                        return true;
                    }

                } else {
                    if (props.type == "signup") {
                        return true;
                    } else {
                        throw new Error();
                    }
                }

            })
            .catch((error) => {

                if (error.response) {
                    if (error.response.data == true || error.response.data == false) {
                        setError("email", {
                            message: props.type == "signup" ? 'A user with this email address already exists.' : 'Email address is not associated with any GameLedger account'
                        })
                    } else {
                        console.log(error);
                    }
                } else {
                    console.log(error);
                }
            });
    }

    const registerUser = async (data) => {
        return await axios.post('http://localhost:3000/users/registerUser', { data })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const login = async (data) => {
        return await axios.post('http://localhost:3000/users/login', { data })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onSubmit = async (data) => {

        if (props.type == "login") {
            const valid = await validateUser(data);

            if (valid) {
                const logSuccess = login(data);
            }


        } else if (props.type == "signup") {
            const valid = await validateEmail(data);

            if (valid) {
                const regSuccess = registerUser(data);

                if (regSuccess) {
                    //const logSuccess = login(data);
                }

            }


        } else if (props.type == "forgot") {
            const valid = await validateEmail(data);
        }
    }

    useEffect(() => {
        reset();
    }, [props.type])

    return (
        <form className='flex justify-center mb-3' onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='mx-8 space-y-3 text-sm text-gray-200 w-full'>

                {props.type == "signup" &&
                    <div>
                        <input className="bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:ring-blue-500 focus:outline-none focus:ring-1 hover:ring-blue-400 hover:outline-none hover:ring-1"
                            type="text"
                            name="username"
                            id="username"
                            placeholder='Username'
                            autoComplete='username'
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Username should be at least 3 characters"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Username should not be more than 20 characters"
                                },
                                validate: (value) => {
                                    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                                        return "Username can only include letters, numbers and _"
                                    }
                                }
                            })}
                        />
                        {errors.username && <span className='text-red-400 text-xs'>{errors.username.message}</span>}
                    </div>
                }

                <input className="bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:ring-blue-500 focus:outline-none focus:ring-1 hover:ring-blue-400 hover:outline-none hover:ring-1"
                    type="email"
                    name="email"
                    id="email"
                    placeholder='Email'
                    autoComplete='email'
                    {...register("email", {
                        required: "Email is required",
                        maxLength: {
                            value: 320,
                            message: "Email should not be more than 320 characters"
                        },
                        validate: (value) => {
                            if (!/^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(value)) {
                                return "Please enter a valid email address"
                            }
                        }
                    })}
                />
                {errors.email && <span className='text-red-400 text-xs'>{errors.email.message}</span>}

                {props.type != "forgot" &&
                    <div>
                        <input className="bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:ring-blue-500 focus:outline-none focus:ring-1 hover:ring-blue-400 hover:outline-none hover:ring-1"
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Password'
                            autoComplete={props.type == "login" ? 'current-password' : 'new-password'}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "password should be at least 8 characters"
                                },
                                maxLength: {
                                    value: 64,
                                    message: "password should not be more than 64 characters"
                                }
                            })}
                        />
                        {errors.password && <span className='text-red-400 text-xs'>{errors.password.message}</span>}
                    </div>
                }

                <button className="bg-blue-500 w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 p-3 font-bold rounded-md text-slate-200 text-nowrap flex justify-center" disabled={isSubmitting}>
                    {isSubmitting ?
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-blue-500 hover:fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        : props.type == "login" ? 'Login' : props.type == "signup" ? 'Sign Up' : 'Continue'}</button>

                {errors.root && <span className='text-red-400 text-xs'>{errors.root.message}</span>}

            </div>
        </form>
    )
}

export default LoginForm