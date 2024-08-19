import React, { useEffect, useState } from 'react'

const Timer = (props) => {

    const [timer, setTimer] = useState(30);
    let timerID;

    const countDown = () => {
        setTimer(prev => prev - 1);
    }

    useEffect(() => {

        //  if (!timerID) {
        timerID = setInterval(countDown, 1000);
        // }

        if (timer <= 0) {
            clearInterval(timerID);
            props.toggleCooldown();
        }


        return () => { clearInterval(timerID) }

    }, [timer])

    return (
        <div>Resend OTP {timer > 0 ? `(${timer})` : null}</div>
    )
}

export default Timer