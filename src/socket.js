// import dotenv from 'dotenv';
// dotenv.config();
import {io} from 'socket.io-client';
import React, { useEffect } from 'react';

export const initSocket = async () =>
{
    const options = {
        'force new connection':true,
        reconnectionAttempt: 'infinity',
        timout:10000, 
        transport:['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);
};