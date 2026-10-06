import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import axios from 'axios';
import { customDebounce } from '../utils/debounce';
import GameSearchItem from './GameSearchItem';
import UserSearchItem from './UserSearchItem'
import { useNavigate } from 'react-router-dom'
import { z } from "zod"

const searchInputSchema = z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " ")) // Clean extra spaces
    .pipe(
        z
            .string()
            .min(1, "Search query cannot be empty")
            .max(50, "Search query is too long")
    );

const Search = (props) => {

    const controllerRef = useRef();
    const searchRef = useRef();
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState();
    const [type, setType] = useState("games");
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const serverURL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        resetField
    } = useForm();

    const onSubmitHandler = (data, action) => {
        const validation = searchInputSchema.safeParse(data?.search || getValues("search"));

        // 2. If validation fails (e.g., empty string or > 50 chars), return early
        if (!validation.success) {
            //console.log(validation.error.issues[0].message);
            return;
        }

        // 3. Extract the cleaned/trimmed query returned by Zod
        const cleanedQuery = validation.data;

        const currentResult = results?.[selectedIndex];

        if (action === "key") {
            if (!currentResult) {
                navigate(`/${type}?search=${cleanedQuery}`);
            } else {
                const targetPath = type === "games"
                    ? `/game/${currentResult.slug}`
                    : `/user/${currentResult.username}`;

                const navigationOptions = type === "users"
                    ? { state: { id: currentResult.id } }
                    : undefined;

                navigate(targetPath, navigationOptions);
            }
        } else if (action === "button") {
            navigate(`/${type}?search=${cleanedQuery}`);
        }

        if(props.isShown === true){
            props.toggleSearch();
        }
        setIsSearching(false);
        resetField("search");
        setType("games");
    };


    const onItemClickHandler = () => {
        if(props.isShown === true){
            props.toggleSearch();
        }
        setIsSearching(false);
        resetField("search");
        setType("games");
    }

    const searchHandler = async (query, signal, currentType) => {

        const route = currentType === "games" ? "games/searchGames" : "users/searchUsers";

        return await axios.post(serverURL + route, { query }, { signal })
            .then((response) => {
                setResults(response.data);
                setIsLoading(false);
            })
            .catch((error) => {

                if (axios.isCancel(error)) {
                    console.log('Previous request safely canceled on the frontend.');
                    // Return nothing or an empty array so your code knows it was just an abort
                    return null;
                } else {
                    // This is an actual network error (e.g., 500 error, database offline)
                    console.error(error);
                    throw error; // Re-throw actual errors so your UI can handle them
                }
            });

    }

    // 1. Create the search function containing your AbortController logic
    const executeSearch = useCallback((searchValue, currentType = type) => {
        // 1. Run Zod validation
        const validation = searchInputSchema.safeParse(searchValue);

        // 2. If validation fails (e.g., empty string or > 50 chars), return early
        if (!validation.success) {
            //console.log(validation.error.issues[0].message);
            return;
        }

        // 3. Extract the cleaned/trimmed query returned by Zod
        const cleanedQuery = validation.data;

        // 4. Abort the previous running network request
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        // 5. Set up the new controller and signal
        const controller = new AbortController();
        controllerRef.current = controller;
        const signal = controller.signal;

        // 6. Fire your API fetch handler
        searchHandler(cleanedQuery, signal, currentType);

    }, [type, searchHandler]);

    // This guarantees 'let timer' is never destroyed or reset by re-renders.
    const debouncedSearchRef = useRef(null);

    if (!debouncedSearchRef.current) {
        debouncedSearchRef.current = customDebounce((val, currentType) => {
            executeSearch(val, currentType)
        }, 600);
    }

    // 3. Watch the React Hook Form input value
    const currentInput = watch('search');

    const searchStatusChange = (currentType) => {

        debouncedSearchRef.current(currentInput, currentType);

        if (currentInput) {
            setIsLoading(true);
            setIsSearching(true);
        } else {
            setIsSearching(false);
            setIsLoading(false);
        }
    }

    const onTypeChange = (currentType) => {
        if (currentType === "games") {
            setType("games");
        } else {
            setType("users");
        }
        setIsLoading(true);
        executeSearch(currentInput, currentType);
    }

    // 4. Trigger the debounced search every time the user types a character
    useEffect(() => {

        searchStatusChange(type);

    }, [currentInput]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                if(!props.isShown){
                    setIsSearching(false);
                    setType("games");
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [props.isShown]);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [currentInput, isSearching]);

    const handleKeyDown = (e) => {

        if (!isSearching || !results) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault(); // Prevent cursor moving to end of input
                setSelectedIndex((prevIndex) =>
                    prevIndex < results.length - 1 ? prevIndex + 1 : 0
                );
                break;

            case "ArrowUp":
                e.preventDefault(); // Prevent cursor moving to start of input
                setSelectedIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : results.length - 1
                );
                break;

            case "Enter":
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    e.preventDefault();
                    e.target.blur();
                    onSubmitHandler(null, "key");
                    if(props.isShown === true){
                        props.toggleSearch();
                    }
                }
                break;

            case "Escape":
                if(props.isShown === true){
                    props.toggleSearch();
                }
                setIsSearching(false);
                setType("games");
                break;

            default:
                break;
        }
    };

    const loadingItem = (count) => {

        const variations = [
            { titleWidth: "w-3/4", badgeCount: 3 },
            { titleWidth: "w-1/2", badgeCount: 1 },
            { titleWidth: "w-4/5", badgeCount: 2 },
            { titleWidth: "w-2/3", badgeCount: 2 },
            { titleWidth: "w-3/5", badgeCount: 1 },
        ];

        return Array.from({ length: count }, (_, i) => {
            const Component = type === 'games' ? GameSearchItem : UserSearchItem;
            return <Component key={i} isLoading={true} variations={variations[i]} />;
        })

    }

    return (
        <form className={`justify-center w-full xl:basis-10/12 transition-all duration-300 ease-in-out ${props.isShown
            ? 'flex opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible absolute pointer-events-none md:opacity-100 md:visible md:pointer-events-auto md:flex md:static'} mt-4 md:mt-0`}
            onKeyDown={handleKeyDown} onSubmit={handleSubmit((e) => onSubmitHandler(e, "key"))} autoComplete='off' role="search">

            <Transition show={props.isShown}
                enter='transition-all ease-in-out origin-[80%_5%] duration-250 '
                enterFrom='scale-0 rounded-b-full'
                enterTo="scale-full rounded-b-none"
                leave="transition-all ease-in-out origin-[80%_5%] duration-250 "
                leaveFrom="scale-full rounded-b-none"
                leaveTo="scale-0 rounded-b-full"
            >
                <div className='fixed top-0 left-0 w-full h-full bg-gray-900 md:hidden'>
                    <div className='flex justify-end p-3 mt-4 md:mt-0'>
                        <button type='button' className='text-slate-300 rounded-lg px-1 hover:bg-slate-800' onClick={props.toggleSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Transition>


            <div className="relative w-full md:w-2/3 lg:w-2/5 xl:w-1/3 mx-3" ref={searchRef}>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none w-full">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" ><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    onFocus={() => searchStatusChange(type)}
                    type="text"
                    name="search"
                    className="text-gray-200 w-full bg-gray-700 border-gray-600 rounded-full ps-10 px-5 py-1 focus:ring-blue-500 focus:outline-none focus:ring-1 hover:ring-blue-400 hover:outline-none hover:ring-1"
                    placeholder="Search"
                    {...register('search')}
                />
                {isSearching &&
                    <div className={`fixed left-2 pr-4 w-full mt-2 md:pr-0 md:absolute md:mt-0 md:left-1/2 md:transform md:-translate-x-1/2 md:w-[calc(100%+8rem)] md:rounded-2xl md:shadow-xl h-auto bg-gray-900 md:top-12`}>
                        <div className='flex m-4 h-6'>
                            <button type='button' onMouseDown={(e) => e.preventDefault()} disabled={isLoading} onClick={() => onTypeChange("games")} className={`w-20 rounded-s-md text-center transition-colors ${type === "games" ? "bg-blue-500 text-slate-100" : "bg-gray-700  hover:text-slate-300 text-slate-400"}`}>Games</button>
                            <div className='w-px bg-gray-900'></div>
                            <button type='button' onMouseDown={(e) => e.preventDefault()} disabled={isLoading} onClick={() => onTypeChange("users")} className={`w-20 rounded-e-md text-center transition-colors ${type === "users" ? "bg-blue-500 text-slate-100" : "bg-gray-700  hover:text-slate-300 text-slate-400"}`}>Users</button>
                        </div>

                        {!isLoading ?
                            <div className='flex-col'>
                                <ul>
                                    {results.length === 0 ? (
                                        <div className="text-center text-slate-400 mt-8 mb-6">No results found</div>
                                    ) : (
                                        results.map((item, index) => {
                                            const isHighlighted = index === selectedIndex;
                                            const commonProps = {
                                                key: item.id,
                                                id: item.id,
                                                isHighlighted,
                                                isLoading: false,
                                                itemClickHandler: onItemClickHandler,
                                                selectedIndex: () => setSelectedIndex(index),
                                            };

                                            if (type === 'games') {
                                                return (
                                                    <GameSearchItem
                                                        {...commonProps}
                                                        name={item.name}
                                                        slug={item.slug}
                                                        releaseDate={item.release_date}
                                                        platforms={item.platforms}
                                                        img={item.cover?.urlBig || null}
                                                    />
                                                );
                                            }

                                            if (type === 'users') {
                                                return (
                                                    <UserSearchItem
                                                        {...commonProps}
                                                        username={item.username}
                                                        img={`${serverURL}uploads/profile_pictures/${item.profile_picture}`}
                                                        topGenres={(item.top_genres || []).slice(0, 3)}
                                                    />
                                                );
                                            }

                                            return null;
                                        })
                                    )}
                                </ul>
                                {results.length > 4 &&
                                    <button type='button' onClick={() => onSubmitHandler(null, "button")} className='w-full py-3 bg-slate-900/40 hover:bg-slate-800 text-blue-400 hover:text-blue-300 font-semibold text-sm border-t border-slate-700/60 rounded-b-xl transition-colors'>Show All</button>
                                }
                            </div>
                            :
                            <div className='flex-col'>
                                <ul>
                                    {loadingItem(5)}
                                </ul>

                                <div className='flex justify-center w-full py-3 bg-slate-900/40  text-blue-400  text-sm border-t border-slate-700/60 rounded-b-xl'>
                                    <div className='flex w-20 py-1'>
                                        <div className="h-3 bg-slate-700 rounded w-4/5 animate-pulse ms-2"></div>
                                    </div>
                                </div>

                            </div>
                        }
                    </div>
                }
            </div>

        </form>

    )
}

export default Search