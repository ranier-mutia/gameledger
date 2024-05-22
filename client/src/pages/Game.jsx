import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios'

const Game = () => {

    const [game, setGame] = useState();
    const controllerRef = useRef();
    const params = useParams();
    const slug = params.slug;

    useEffect(() => {

        const getGame = async (signal) => {

            await axios.post('http://localhost:3000/games/getGame', { slug }, { signal })
                .then((response) => {
                    setGame(response.data);

                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getGame(signal);

        return () => controllerRef.current.abort();

    }, []);



    return (
        <div></div>
    )
}

export default Game