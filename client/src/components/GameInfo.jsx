import React from 'react'

const GameInfo = (props) => {

    if(!props.isLoading){
        return (
            <div className='bg-gray-800 w-full p-5 mb-4 sm:w-60 sm:me-5 rounded-xl text-blue-400 space-y-3 text-sm font-medium'>
                <div>
                    <div>Ratings:</div>
                    <div className='gameInfoItem'>
                        <span>IGDB: {props.game.rating ? <span className='text-slate-400'>{props.game.rating.toFixed(2) + ' / 100'} </span> : <span className='text-slate-400'>N/A</span>} </span>
                        <span>Users: {props.score ? <span className='text-slate-400'>{props.score + ' / 100'} </span> : <span className='text-slate-400'>N/A</span>} </span>
                    </div>
                </div>
    
                <div>
                    <div>Release Date:</div>
                    <div className='gameInfoItem'>
                        <span>{props.game.release_date ? props.game.release_date : <span className='text-slate-500'>N/A</span>}</span>
                    </div>
                </div>
    
                <div>
                    <div>Platforms:</div>
                    <div className='gameInfoItem'>
                        {props.game.platforms ? props.game.platforms.map(item => {
                            return <span key={item.id}>{item.name}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Genres:</div>
                    <div className='gameInfoItem'>
                        {props.game.genres ? props.game.genres.map(item => {
                            return <span key={item.id}>{item.name}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Themes:</div>
                    <div className='gameInfoItem'>
                        {props.game.themes ? props.game.themes.map(item => {
                            return <span key={item.id}>{item.name}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Game Modes:</div>
                    <div className='gameInfoItem'>
                        {props.game.game_modes ? props.game.game_modes.map(item => {
                            return <span key={item.id}>{item.name}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Player Perspectives:</div>
                    <div className='gameInfoItem'>
                        {props.game.player_perspectives ? props.game.player_perspectives.map(item => {
                            return <span key={item.id}>{item.name}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Supported Languages:</div>
                    <div className='gameInfoItem'>
                        {props.game.language_supports ? props.game.language_supports.map(item => {
                            return <span key={item.id}>{item.language_support_type == 3 ? <span>{item.language.name}</span> : null}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Alternative Names:</div>
                    <div className='gameInfoItem'>
                        {props.game.alternative_names ? props.game.alternative_names.map(item => {
                            return <span key={item.id}>{item.comment}: <span className='text-slate-400 font-normal'>{item.name}</span></span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Developers:</div>
                    <div className='gameInfoItem'>
                        {props.game.involved_companies ? props.game.involved_companies.map(item => {
                            return <span key={item.id}>{item.developer == true ? <span>{item.company.name}</span> : null}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Publishers:</div>
                    <div className='gameInfoItem'>
                        {props.game.involved_companies ? props.game.involved_companies.map(item => {
                            return <span key={item.id}>{item.publisher == true ? <span>{item.company.name}</span> : null}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
                <div>
                    <div>Game Engines:</div>
                    <div className='gameInfoItem'>
                        {props.game.game_engines ? props.game.game_engines.map(item => {
                            return <span key={item.id}>{item.name}</span>
                        })
                            : <span className='text-slate-500'>N/A</span>}
                    </div>
                </div>
    
    
            </div>
        )
    } else {
        return (
            <div className='bg-gray-800 w-full p-5 mb-4 sm:w-60 sm:me-5 rounded-xl space-y-3'>
                <div className='animate-pulse space-y-8'>
                    <div className='flex flex-col space-y-5'>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                        <div className="h-2 bg-slate-700 rounded w-16"></div>
                        <div className="h-2 bg-slate-700 rounded w-14"></div>
                    </div>
        
                    <div className='flex flex-col space-y-5'>
                        <div className="h-3 bg-slate-700 rounded w-20"></div>
                        <div className="h-2 bg-slate-700 rounded w-16"></div>
                    </div>

                    <div className='flex flex-col space-y-5'>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                        <div className="h-2 bg-slate-700 rounded w-20"></div>
                        <div className="h-2 bg-slate-700 rounded w-32"></div>
                        <div className="h-2 bg-slate-700 rounded w-24"></div>
                    </div>

                    <div className='flex flex-col space-y-5'>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                        <div className="h-2 bg-slate-700 rounded w-16"></div>
                        <div className="h-2 bg-slate-700 rounded w-14"></div>
                    </div>
                </div>
    
            </div>
        )
    }
    
}

export default GameInfo