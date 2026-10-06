import React, { useEffect, useState, useRef, useMemo } from 'react'
import Card from '../components/Card';
import axios from 'axios'
import { useSearchParams } from "react-router-dom";
import { GAME_MODES, SORT_OPTIONS } from "../constants/igdbFilters.js"
import { useGameFilters } from '../hooks/useGameFilters.js';
import { ComboboxFilter } from '../components/ComboboxFilter.jsx';
import SearchFilter from '../components/SearchFilter.jsx';
import { DropdownFilter } from '../components/DropdownFilter.jsx';
import MoreFilter from '../components/MoreFilter.jsx';
import { ActiveFilterBadges } from '../components/ActiveFilterBadges.jsx';
import { createFilterSchema } from '../schemas/filterSchema.js';

const serverURL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;

const Games = (props) => {

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [hasResults, setHasResults] = useState(true);

  const controllerRef = useRef();

  const [filterParams, setFilterParams] = useSearchParams();

  const { igdbFilters } = useGameFilters();

  const validatedFilterParams = useMemo(() => {
    // 1. Parse URL params with Zod
    const rawParams = Object.fromEntries(filterParams.entries());
    const schema = createFilterSchema(igdbFilters);
    const validated = schema.parse(rawParams);

    // 2. Rebuild clean URLSearchParams from validated data
    const cleanParams = new URLSearchParams();

    Object.entries(validated).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) cleanParams.set(key, value.join(','));
      } else if (value !== undefined && value !== null && value !== '') {
        cleanParams.set(key, String(value));
      }
    });

    return cleanParams;
  }, [filterParams, igdbFilters]);

  const query = validatedFilterParams.get('search') || "";

  const isSearching = useMemo(() => {
    const query = validatedFilterParams.get('search');
    return query ? true : false;
  }, [validatedFilterParams]);


  const getGames = async (signal, state, currentOffset = offset) => {
    if (!hasNext && state !== "initial") return;

    setIsLoading(true);

    // Determine request offset reliably
    const requestOffset = state === "initial" ? 0 : currentOffset;

    if (requestOffset >= 5000) {
      setHasNext(false);
      return;
    }
  
    const filters = Object.fromEntries(validatedFilterParams.entries());

    try {
      const response = await axios.post(
        serverURL + "games/getGames",
        filters,
        { signal }
      );

      const result = response.data.slice(0, 24);

      if (requestOffset === 0 && response.data.length === 0) {
        setHasResults(false);
        setGames([]);
      } else if (state === "initial") {
        setGames(result);
        setOffset(24); // Prepare offset for next page
        setHasResults(true);
      } else {
        setGames((prevGames) => [...prevGames, ...result]);
        setOffset((prevOffset) => prevOffset + 24);
      }

      if (response.data.length < 24) {
        setHasNext(false);
      }
    } catch (error) {
      if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadingCard = (count) => {

    let cards = []

    for (let i = 0; i < count; i++) {
      cards.push(<Card key={i} isLoading={true} />)
    }

    return cards;

  }

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    // 1. Reset pagination guard so new search isn't blocked
    setHasNext(true);

    // 2. Pass 0 explicitly as the initial offset argument
    getGames(signal, "initial", 0);

    return () => controllerRef.current?.abort();
  }, [validatedFilterParams]); // Runs whenever the search query changes


  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      // 1. Check if bottom is reached AND we aren't currently fetching AND more items exist
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (isLoading || !hasNext) return; // Prevent double-fetching / abort loops!

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        // 2. Pass offset directly to avoid stale closure issues
        getGames(signal, "loadMore", offset);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasNext, offset]);

  const filterCount = useMemo(() => {
    let count = 0;

    for(const [key, value] of validatedFilterParams.entries()) {
      if(key == "sort" || key == "search" || key == "offset" || !value) continue;

      if(value.includes(',')) {
        count += value.split(',').filter(Boolean).length;
      } else {
        count += 1;
      }
    }

    return count;
  })
  

  const updateSearchParam = (val, paramKey) => {
    setFilterParams(
      (prevParams) => {
        const newParams = new URLSearchParams(window.location.search);

        if (val?.length >= 1) {
          newParams.set(paramKey, val);
          newParams.set('sort', 'relevance');
        } else {
          newParams.delete(paramKey);
        }

        return newParams;
      },
      { replace: true }
    );
  }

  const handleComboBoxToggle = (id, paramKey) => {
    setFilterParams(
      (prevParams) => {
        const newParams = new URLSearchParams(window.location.search);

        // Parse current IDs directly from the latest URL parameter state
        const currentParam = newParams.get(paramKey);
        const currentIds = currentParam ? currentParam.split(',') : [];

        // Normalize IDs to strings for strict equality checks
        const targetId = String(id);
        const isSelected = currentIds.some((item) => String(item) === targetId);

        const updated = isSelected
          ? currentIds.filter((item) => String(item) !== targetId)
          : [...currentIds, targetId];

        if (updated.length > 0) {
          newParams.set(paramKey, updated.join(','));
        } else {
          newParams.delete(paramKey);
        }

        return newParams;
      },
      { replace: true }
    );
  };

  const handleDropdownToggle = (id, paramKey) => {
    setFilterParams((prevParams) => {
      const paramsCopy = new URLSearchParams(window.location.search);
      paramsCopy.set(paramKey, id);
      return paramsCopy;
    },
      { replace: true })
  };

  const handlePillToggle = (item, paramKey, multiSelect, selectedItem) => {
    setFilterParams(
      (prevParams) => {
        const newParams = new URLSearchParams(window.location.search);

        if (multiSelect) {
          // Safe array fallback prevents runtime TypeError if state is empty/null
          const currentItems = Array.isArray(selectedItem) ? selectedItem : [];
          const isSelected = currentItems.includes(item);

          const updated = isSelected
            ? currentItems.filter((id) => id !== item)
            : [...currentItems, item];

          if (updated.length > 0) {
            newParams.set(paramKey, updated.join(','));
          } else {
            newParams.delete(paramKey);
          }
        } else {
          // Single-select toggle: clear parameter if tapped again
          if (selectedItem !== item) {
            newParams.set(paramKey, String(item));
          } else {
            newParams.delete(paramKey);
          }
        }

        return newParams;
      },
      { replace: true }
    );
  };

  const handleYearToggle = (value, type, paramStart, paramEnd) => {
    let paramKey = "";
    if (type == "from") {
      paramKey = paramStart;
    } else {
      paramKey = paramEnd;
    }

    const newParams = new URLSearchParams(window.location.search);
    if (value) {
      newParams.set(paramKey, value);
    } else {
      newParams.delete(paramKey);
    }
    setFilterParams(newParams, { replace: true });
  };

  // 2. Remove an individual filter badge
  const removeBadge = (paramKey, itemValue) => {
    setFilterParams(
      (prev) => {

        const next = new URLSearchParams(window.location.search);
        const currentValue = next.get(paramKey);

        if (!currentValue) return next;

        if (currentValue.includes(',')) {
          // Filter out the removed item from comma-separated list
          const updated = currentValue
            .split(',')
            .filter((v) => v != itemValue)
            .join(',');

          if (updated) {
            next.set(paramKey, updated);
          } else {
            next.delete(paramKey);
          }
        } else {
          // Single-select parameter deletion
          next.delete(paramKey);
        }

        return next;
      },
      { replace: true }
    );
  };

  const resetAll = () => {
    setFilterParams({ sort: "popularity_desc" }, { replace: true });
  };


  return (
    <div className='flex justify-center h-full w-full pt-20 pb-20 xl:ps-[18rem] overflow-x-hidden'>
      <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-8 xl:px-8 xl:py-2'>

        <div>

          <div className='space-y-1 md:flex'>

            <div className='flex-col space-y-1 w-full md:w-64 me-2 content-end'>
              <SearchFilter
                paramKey="search"
                filterParams={validatedFilterParams}
                updateSearchParam={updateSearchParam}
              />
            </div>

            <div className="flex md:space-x-2 mb-8 rounded-lg h-auto w-full">

              <div className='space-y-1 w-full hidden md:flex md:flex-col'>
                <h1 className='text-white p-1'>Platforms</h1>
                <ComboboxFilter
                  label="Platforms"
                  paramKey="platforms"
                  options={igdbFilters?.platforms}
                  hasSearch={true}
                  filterParams={validatedFilterParams}
                  handleComboBoxToggle={handleComboBoxToggle}
                />
              </div>

              <div className='flex-col space-y-1 w-full hidden md:flex md:flex-col'>
                <h1 className='text-white p-1'>Genres</h1>
                <ComboboxFilter
                  label="Genres"
                  paramKey="genres"
                  options={igdbFilters?.genres}
                  hasSearch={false}
                  filterParams={validatedFilterParams}
                  handleComboBoxToggle={handleComboBoxToggle}
                />
              </div>

              <div className='flex-col space-y-1 w-full hidden md:flex md:flex-col'>
                <h1 className='text-white p-1'>Game Modes</h1>
                <ComboboxFilter
                  label="Game Modes"
                  paramKey="gameModes"
                  options={GAME_MODES}
                  hasSearch={false}
                  filterParams={validatedFilterParams}
                  handleComboBoxToggle={handleComboBoxToggle}
                />
              </div>

              <div className='flex-col space-y-1 w-full pe-2 md:pe-0'>
                <h1 className='text-white p-1 hidden md:flex'>Sort</h1>
                <DropdownFilter
                  label="Sort"
                  paramKey="sort"
                  options={SORT_OPTIONS}
                  hasSearch={false}
                  isSearching={isSearching}
                  filterParams={validatedFilterParams}
                  handleDropdownToggle={handleDropdownToggle}
                />
              </div>

              <MoreFilter
                filterParams={validatedFilterParams}
                filterCount={filterCount}
                handleComboBoxToggle={handleComboBoxToggle}
                handlePillToggle={handlePillToggle}
                handleYearToggle={handleYearToggle}
                resetAll={resetAll}
              />

            </div>

          </div>

          <ActiveFilterBadges
            filterParams={validatedFilterParams}
            removeBadge={removeBadge}
            resetAll={resetAll}
          />

          <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6 xl:gap-4 mt-6'>

            {games?.map((item, i) => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                slug={item.slug}
                img={item.cover?.urlBig}
                isLoading={false}
              />
            ))}

            {isLoading && (games.length === 0 ? loadingCard(24) : loadingCard(6))}


          </div>

          {!hasResults && !isLoading &&
            <div className='flex-col w-full text-white text-center mt-40 justify-items-center px-5'>
              <div className="p-3 mb-3 rounded-full bg-slate-800/60 border border-slate-700/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-slate-300"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg></div>

              <h3 className="text-2xl font-semibold text-slate-200">No games found {query && <span>for<span className="text-blue-400"> "{query}"</span></span>}</h3>
              {validatedFilterParams && <p className="mt-1 text-base text-slate-400">Check your spelling, or try searching with different filters.</p>}
            </div>
          }

        </div>

      </div>
    </div >

  )
}

export default Games

