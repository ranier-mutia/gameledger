import React, { useState } from 'react'
import LoginForm from '../../components/LoginForm';

function Login(props) {

    if (props.isShown) {

        const [type, setType] = useState("login");

        const onTypeClickHandler = () => {
            if (type == "login" || type == "forgot") {
                setType("signup")
            } else setType("login");
        }

        return (
            <div className='fixed flex justify-center items-center h-screen w-screen bg-opacity-80 bg-black z-50'>

                <div className='bg-gray-800 w-full h-full sm:rounded-xl sm:h-auto sm:min-h-1/2 sm:w-80 md:w-96 xl:w-1/5 pb-8 shadow-xl'>

                    <div className='flex justify-end'>
                        <button className='text-slate-300 rounded-lg p-1 m-2  hover:bg-slate-700' onClick={props.onLoginClickHandler}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className='flex justify-center space-x-1 mb-6'>
                        <span className='text-slate-200 pt-0.5 select-none'>{type == "login" ? 'Login to' : type == "signup" ? 'Sign up to' : "Forgot Password"}</span>
                        {type != "forgot" && <span className='text-blue-400 font-medium text-lg select-none'>GameLedger</span>}
                    </div>

                    {type != "forgot" &&
                        <div>
                            <div className='flex justify-center mx-8 mb-4'>
                                <button className="bg-white w-full rounded-md px-3 py-2 flex justify-center gap-2 font-bold text-slate-600 text-nowrap hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300">
                                    <img className="w-4 h-4 my-auto" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                    <span>{type == "login" ? 'Login' : 'Sign up'} with Google</span>
                                </button>
                            </div>

                            <span className='flex justify-center text-slate-400 text-xs font-medium mb-4 select-none'>OR</span>
                        </div>
                    }

                    {type == "forgot" &&
                        <div className='flex justify-center mx-8 mb-4'>
                            <span className='text-slate-400 text-xs'>Enter your email address associated with your account and we'll send you a link to reset your password.</span>
                        </div>
                    }

                    <LoginForm type={type} />

                    {type == "login" &&
                        <div className='flex justify-center text-xs'>
                            <span className=' text-blue-400 hover:text-blue-500 cursor-pointer select-none' onClick={() => setType("forgot")}>Forgot password?</span>
                        </div>
                    }


                    <div className='flex justify-center space-x-2 mt-6'>
                        <span className='text-slate-200 pt-0.5 select-none text-xs'>{type == "login" || type == "forgot" ? "Don't have an account?" : 'Already a member?'}</span>
                        <button className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 py-1 px-3 font-medium rounded-md text-slate-100 text-nowrap text-xs" onClick={onTypeClickHandler}>{type == "login" || type == "forgot" ? 'Sign Up' : 'Login'}</button>
                    </div>




                </div>
            </div>
        )
    }

}

export default Login