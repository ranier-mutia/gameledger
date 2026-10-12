import React, { useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom'
import { useUserContext } from '../hooks/UserContext';
import LoginContext from '../hooks/LoginContext';
import { ListButton } from './ListButton'
import ListMenu from './ListMenu'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function GameCarousel(props) {

  const [isListShown, setIsListShown] = useState(false);
  const [listMenuData, setListMenuData] = useState({
    slug: "",
    list: "",
    fave: ""
  });
  const [triggerAction, setTriggerAction] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const user = useUserContext();
  const showLoginMenu = useContext(LoginContext);

  const showListMenu = (slugData, listData, favoriteData) => {
    setListMenuData({
      slug: slugData,
      list: listData,
      fave: favoriteData
    })

    setIsListShown(true);
  }

  const onListCloseHandler = () => {
    setIsListShown(false);
  }

  const updateDataTrigger = () => {
    setTriggerAction(prev => prev + 1);
  }

  useEffect(() => {
    if (isListShown) {
      document.body.style.overflow = 'hidden'
    }
    !isListShown ? document.body.style.overflow = 'unset' : null;
  }, [isListShown]);

  if (props.games) {

    return (
      <div>

        {isListShown &&
          <ListMenu isShown={isListShown} slug={listMenuData.slug} listData={listMenuData.list} favoriteData={listMenuData.fave} onListCloseHandler={onListCloseHandler} updateData={updateDataTrigger} />
        }

        <div className="flex justify-between pe-2">
          <h1 className='text-lg font-bold drop-shadow-lg text-slate-200 cursor-default'>{props.title}</h1>
          <Link to={"/games" + props.path} className='text-xs font-bold drop-shadow-lg text-blue-300 hover:text-blue-400'>View All</Link>
        </div>

        <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl'></div>

        <div className='w-full mt-6 pb-6'>

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: '.custom-prev',
              nextEl: '.custom-next'
            }}
            autoplay={{ delay: 600000, pauseOnMouseEnter: true, disableOnInteraction: false }}
            loop={true}
            className='rounded-2xl'
          >
            {props.games ? props.games.map((item, i) => (
              <SwiperSlide key={item.id}>

                <div className="flex flex-col md:flex-row h-auto">

                  <div className='md:w-3/5 relative'>
                    <img src={item.bigArtwork ? item.bigArtwork : item.bigScreenshot ? item.bigScreenshot : null} alt={item.title} loading={i === 0 ? 'eager' : 'lazy'} className="swiper-lazy h-[12rem] md:h-[24rem] w-full rounded-t-xl md:rounded-t-none md:rounded-l-xl" />

                    <span className="absolute md:hidden right-3 top-3 z-20 items-center gap-1.5 bg-gray-900/60 text-white border border-blue-500/30 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit">
                      <span>📅</span>
                      <span>{item.release_date || 'TBA'}</span>
                    </span>

                  </div>

                  <div className='flex flex-col md:w-2/5 h-[16rem] md:h-[24rem] bg-gray-800 rounded-b-xl md:rounded-b-none md:rounded-r-xl p-4 md:ps-6 relative'>

                    <h1 className='text-white text-md md:text-xl basis-1'>{item.name}</h1>

                    <span className="hidden md:inline-flex mt-2 items-center gap-1.5 bg-blue-700/20 text-white border border-blue-500/30 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit">
                      <span>📅</span>
                      <span>{item.release_date || 'TBA'}</span>
                    </span>

                    <div className='flex text-left min-h-4 text-blue-300 text-xs space-x-1 md:font-medium text-nowrap flex-wrap md:pt-2'>
                      {item.platforms?.slice(0, 3).map((item, i) => {
                        return <span className={`${item.abbreviation && "bg-blue-950 px-2 rounded-md py-1"}`} key={item.id}>{item.abbreviation}</span>
                      })}
                      {item.platforms?.length > 3 && (
                        <span className={`bg-blue-950 px-2 rounded-md py-1`} >+{item.platforms?.length} more</span>
                      )}
                    </div>

                    <div className='overflow-y-auto md:overflow-y-hidden md:hover:overflow-y-auto text-sm xl:text-base h-auto mt-4 text-slate-300 basis-full'>
                      <p >{item.summary}</p>
                    </div>

                    <div className='flex flex-col xl:flex-row justify-between space-y-2 xl:space-x-2 pt-2 xl:space-y-0 basis-1'>

                      <div className='w-full'>
                        <ListButton
                          game={item}
                          user={user}
                          showLoginMenu={showLoginMenu}
                          showListMenu={showListMenu}
                          flow={'up'}
                          triggerUpdate={triggerAction}
                        />
                      </div>

                      <Link to={"/game/" + item.slug} className='text-slate-300 text-xs md:text-sm font-medium text-nowrap flex flex-nowrap space-x-1 bg-black rounded-lg py-1 px-3 h-7 md:h-8 items-center justify-center'>
                        <span>View Details</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className=''
                        >
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        </svg>

                      </Link>

                    </div>

                    {/* Dots Container positioned relative to this Right Div */}
                    <div className="hidden md:flex items-center justify-center pt-4">

                      {/* Render interactive dots relative to right panel */}
                      <div className="flex items-center gap-1.5">
                        {props.games?.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => swiperInstance?.slideToLoop(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                              ? 'w-5 bg-blue-500'
                              : 'w-2 bg-slate-600 hover:bg-slate-400'
                              }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </SwiperSlide>
            )) : ''}

            <div className="flex md:hidden items-center justify-center pt-4">

              {/* Render interactive dots relative to right panel */}
              <div className="flex items-center gap-1.5">
                {props.games?.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => swiperInstance?.slideToLoop(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                      ? 'w-5 bg-blue-500'
                      : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>


            <div className="absolute top-0 left-0 w-full md:w-[60%] h-[42%] md:h-full pointer-events-none z-20">
              {/* Left Arrow */}
              <button className="custom-prev pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center text-white transition-all disabled:opacity-30 text-4xl pb-2">
                ‹
              </button>

              {/* Right Arrow (Anchored to right edge of image section) */}
              <button className="custom-next pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center text-white transition-all disabled:opacity-30 text-4xl pb-2">
                ›
              </button>
            </div>
          </Swiper>
        </div>
      </div>
    );

  } else {

    return (
      <div className='pb-6'>
        <div className="flex justify-between pe-2">
          <h1 className='text-lg font-bold drop-shadow-lg text-slate-200 cursor-default'>{props.title}</h1>
          <Link to={"/games" + props.path} className='text-xs font-bold drop-shadow-lg text-blue-300 hover:text-blue-400'>View All</Link>
        </div>

        <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl'></div>

        <div className='w-full mt-6  rounded-2xl animate-pulse'>
          <div className="flex flex-col md:flex-row h-auto">

            <div className='md:w-3/5 h-[12rem] md:h-[24rem] rounded-t-xl md:rounded-tr-none md:rounded-l-xl bg-gray-800/80'></div>
            
            <div className='flex flex-col md:w-2/5 rounded-b-xl h-[16rem] md:h-[24rem] md:rounded-b-none md:rounded-r-xl p-4 md:ps-6 bg-gray-800 '>

              <div className='flex flex-col h-full'>
                <span className='h-4 w-52 bg-slate-700 rounded animate-pulse mt-2'></span>

                <span className='h-4 w-24 bg-slate-700 rounded animate-pulse px-3 py-1.5 mt-4'></span>

                <span className='h-3 bg-slate-700 rounded animate-pulse mt-6 me-12'></span>
                <span className='h-3 bg-slate-700 rounded animate-pulse mt-3'></span>
                <span className='h-3 bg-slate-700 rounded animate-pulse mt-3 me-24'></span>
              </div>

              <div className='flex flex-col items-center'>
                <div className='flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='h-6 w-full md:basis-3/5 bg-slate-700 rounded animate-pulse'></div>
                  <div className='h-6 w-full md:basis-2/5 bg-slate-700 rounded animate-pulse'></div>
                </div>
                <div className='h-2 w-24 justify-self-center items-center bg-slate-700 rounded animate-pulse mt-2'></div>
              </div>

            </div>
          </div>
        </div>


      </div>
    )

  }
}