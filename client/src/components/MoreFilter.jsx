import { useState, useRef, useEffect } from "react"
import { Transition } from "@headlessui/react";
import { GAME_MODES, PLAYER_PERSPECTIVES, YEAR_OPTIONS } from "../constants/igdbFilters.js"
import { useGameFilters } from '../hooks/useGameFilters.js';
import { ComboboxFilter } from '../components/ComboboxFilter.jsx';
import { PillFilter } from "./PillFilter.jsx";
import { YearRangeFilter } from "./YearRangeFilter.jsx";

const MoreFilter = (props) => {

    const filterRef = useRef();

    const [isOpen, setIsOpen] = useState(false);

    const { igdbFilters } = useGameFilters();

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // Query mobile viewport status directly
        const isMobileViewport = window.innerWidth < 768; // adjust breakpoint as needed

        if (!isOpen || !isMobileViewport) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isOpen]);

    return (
        <div className='content-end pb-0.5 w-full md:w-auto relative' ref={filterRef}>
            <button onClick={() => setIsOpen((prev) => !prev)} type='button' className='bg-gray-800 text-slate-200 p-2 rounded-lg w-full flex justify-center items-center gap-2 text-nowrap'>
                <svg
                    className=' md:flex'
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span className='md:hidden'>{`Filters (${props.filterCount || '0'})`}</span>

            </button>

            <Transition show={isOpen}
                enter='transition-all ease-in-out origin-[75%_15%] md:origin-top-right duration-250 '
                enterFrom='scale-0 rounded-full'
                enterTo="scale-full rounded-none"
                leave="transition-all ease-in-out origin-[75%_15%] md:origin-top-right duration-250 "
                leaveFrom="scale-full rounded-none"
                leaveTo="scale-0 rounded-full"
            >
                <div className="fixed w-full h-full top-0 left-0 z-50 md:absolute md:w-[36rem] md:h-auto bg-gray-800 md:left-auto md:right-0 md:top-20 md:z-10 rounded-xl overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                    <header className="flex md:hidden items-center justify-between px-5 py-4 border-b border-slate-600 bg-gray-800 ">

                        <h1 className="text-lg font-bold text-white">
                            Filters
                        </h1>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={props.resetAll}
                                type="button"
                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Reset All
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-slate-400 hover:text-white transition-colors"
                                aria-label="Close filters"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                    </header>

                    <div className="flex-col p-4 space-y-4 md:space-y-0 md:gap-2 md:flex">

                        <div className='space-y-1 w-full md:hidden'>
                            <h1 className='text-white p-1'>Platforms</h1>
                            <ComboboxFilter
                                label="Platforms"
                                paramKey="platforms"
                                options={igdbFilters?.platforms}
                                hasSearch={true}
                                mobile={true}
                                filterParams={props.filterParams}
                                handleComboBoxToggle={props.handleComboBoxToggle}
                            />
                        </div>

                        <div className='space-y-1 w-full md:hidden'>
                            <h1 className='text-white p-1'>Genres</h1>
                            <ComboboxFilter
                                label="Genres"
                                paramKey="genres"
                                options={igdbFilters?.genres}
                                mobile={true}
                                filterParams={props.filterParams}
                                handleComboBoxToggle={props.handleComboBoxToggle}
                            />
                        </div>

                        <div className='space-y-1 w-full md:hidden'>
                            <h1 className='text-white p-1'>Game Modes</h1>
                            <ComboboxFilter
                                label="Game Modes"
                                paramKey="gameModes"
                                options={GAME_MODES}
                                mobile={true}
                                filterParams={props.filterParams}
                                handleComboBoxToggle={props.handleComboBoxToggle}
                            />
                        </div>

                        <div className='space-y-1 w-full'>
                            <h1 className='text-white p-1'>Release Year</h1>
                            <YearRangeFilter
                                paramStart="startYear"
                                paramEnd="endYear"
                                options={YEAR_OPTIONS}
                                filterParams={props.filterParams}
                                handleYearToggle={props.handleYearToggle}
                            />
                        </div>

                        <div className='space-y-1 w-full'>
                            <h1 className='text-white p-1'>Player Perspective</h1>
                            <div className="p-3 bg-[#121927] border border-slate-800 rounded-xl">
                                <PillFilter
                                    label="perspective"
                                    paramKey="perspective"
                                    options={PLAYER_PERSPECTIVES}
                                    filterParams={props.filterParams}
                                    handlePillToggle={props.handlePillToggle}
                                />
                            </div>
                        </div>

                        <div className='space-y-1 w-full'>
                            <h1 className='text-white p-1'>Themes</h1>
                            <div className="p-3 bg-[#121927] border border-slate-800 rounded-xl">
                                <PillFilter
                                    label="themes"
                                    paramKey="themes"
                                    options={igdbFilters?.themes}
                                    multiSelect={true}
                                    filterParams={props.filterParams}
                                    handlePillToggle={props.handlePillToggle}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </Transition>


        </div>
    )

}


export default MoreFilter