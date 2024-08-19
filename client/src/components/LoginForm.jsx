import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import Timer from './Timer';
import OTPInput from './OTPInput';

const LoginForm = (props) => {

    const [status, setStatus] = useState({
        emailSent: false,
        cooldown: false,
        email: "",
        validOTP: false,
        resetSuccess: false
    });

    const [errorOTP, setErrorOTP] = useState("");

    const toggleCooldown = () => {
        setStatus(prev => { return { ...prev, cooldown: false } })
    }

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm();

    const login = async (data) => {

        await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/login', { username: data.email, password: data.password }, { withCredentials: true })
            .then((response) => {
                const user = response.data;

                if (!user) throw new Error();

                props.authenticateUser();
                props.onLoginClickHandler();

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

    const googleAuth = async () => {
        window.open(`${import.meta.env.VITE_REACT_APP_SERVER_BASEURL}users/googleAuth`, "_self");
    }

    const validateEmail = async (data) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/validateEmail', { data: { ...data, type: props.type } })
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
        await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/registerUser', { data }, { withCredentials: true })
            .then((response) => {

                if (response.data) {
                    props.authenticateUser();
                    props.onLoginClickHandler();
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    const forgotPassword = async (email) => {
        return await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/forgotPassword', { email }, { withCredentials: true })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onOTPSubmit = async (OTP) => {

        setErrorOTP("");

        if (OTP.length == 6) {

            await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/verifyOTP', { OTP }, { withCredentials: true })
                .then((response) => {
                    const result = response.data;

                    if (result == "valid") {
                        setStatus(prev => { return { ...prev, validOTP: true } })
                    } else if (result == "invalid") {
                        setErrorOTP("Invalid OTP");
                    } else if (result == "expired") {
                        setErrorOTP("OTP expired");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        } else {
            setErrorOTP("Incomplete Field");
        }



    }

    const sendOTP = async (email) => {

        setStatus({ emailSent: true, cooldown: true, email: email, validOTP: false, resetSuccess: false });
        const success = await forgotPassword(email);

    }

    const resetPassword = async (email, password) => {

        return await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/resetPassword', { email, password })
            .then((response) => {
                const result = response.data;

                if (result) {
                    setStatus(prev => { return { ...prev, resetSuccess: true } })
                } else {
                    throw new Error();
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data == true || error.response.data == false) {
                        setError("root", {
                            message: "Password reset failed."
                        })
                    } else {
                        console.log(error);
                    }
                } else {
                    console.log(error);
                }
            });

    }

    const onSubmit = async (data) => {

        if (props.type == "login") {
            await login(data);

        } else if (props.type == "signup") {
            const valid = await validateEmail(data);

            if (valid) {
                await registerUser(data);
            }

        } else if (props.type == "forgot" && status.validOTP == false) {
            const valid = await validateEmail(data);

            if (valid) {
                sendOTP(data.email);
            }
        } else if (status.validOTP && !status.resetSuccess) {
            await resetPassword(status.email, data.password)
        } else if (status.resetSuccess) {
            props.onTypeClickHandler();
        }


    }

    useEffect(() => {
        reset();
        setStatus({ emailSent: false, cooldown: false, email: "", validOTP: false, resetSuccess: false })
        setErrorOTP("");
    }, [props.type])

    return (
        <form className='flex justify-center mb-3' onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className='mx-8 space-y-3 text-sm text-gray-200 w-full'>

                {props.type == "forgot" && status.validOTP == false &&
                    <div className='flex mb-4 w-full'>
                        <span className='text-slate-400 text-xs'>{status.emailSent == false ? "Enter your email address associated with your account and we'll send you an OTP to reset your password." : "Please enter the OTP sent to your email: " + status.email}</span>
                    </div>
                }

                {status.validOTP && !status.resetSuccess &&
                    <div className='flex mb-4 w-full'>
                        <span className='text-slate-400 text-xs'>Please enter your new password.</span>
                    </div>
                }

                {status.resetSuccess &&
                    <div className='flex mb-4 w-full'>
                        <span className='text-slate-400 text-xs'>Your password had been successfuly reset. You may now login with your account.</span>
                    </div>
                }

                {props.type == "forgot" && status.emailSent == true && status.validOTP == false &&
                    <OTPInput length={6} onOTPSubmit={onOTPSubmit} isSubmitting={isSubmitting} errorOTP={errorOTP} />
                }

                {props.type != "forgot" &&
                    <div>
                        <a className='flex justify-center mb-4 w-full cursor-pointer select-none' onClick={googleAuth}>
                            <div className="bg-white w-full rounded-md px-3 py-2 flex justify-center gap-2 font-bold text-slate-600 text-nowrap hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300">
                                <img className="w-4 h-4 my-auto" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                <span>{props.type == "login" ? 'Login' : 'Sign up'} with Google</span>
                            </div>
                        </a>

                        <span className='flex justify-center text-slate-400 text-xs font-medium select-none'>OR</span>
                    </div>
                }

                {props.type == "signup" &&
                    <div>
                        <input className={`bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.username ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
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

                {status.emailSent == false &&
                    <div>
                        <input className={`bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.email ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
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
                    </div>
                }

                {props.type != "forgot" || status.validOTP ?
                    <div>
                        {!status.resetSuccess &&
                            <div>
                                <input className={`bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.password ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
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

                    </div> : null
                }

                {!status.emailSent || status.validOTP ?

                    <button className={`bg-blue-500 w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 p-3 font-bold rounded-md text-slate-200 text-nowrap flex justify-center`} disabled={isSubmitting}>
                        {isSubmitting ?
                            <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-blue-500 hover:fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            : props.type == "login" || status.resetSuccess ? 'Login' : props.type == "signup" ? 'Sign Up' : 'Send'}</button> : null

                }

                {errors.root && <span className='text-red-400 text-xs'>{errors.root.message}</span>}

                {props.type == "forgot" && status.emailSent && status.validOTP == false &&

                    <button className={`flex mx-auto text-xs text-blue-400 ${status.cooldown && 'disabled:text-gray-400'}`} disabled={status.cooldown} onClick={() => sendOTP(status.email)}>
                        {status.cooldown ? <Timer toggleCooldown={toggleCooldown} /> : 'Resend OTP'}
                    </button>

                }

            </div>
        </form>
    )
}

export default LoginForm