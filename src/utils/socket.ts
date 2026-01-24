// import { io, Socket } from 'socket.io-client';

// let socket: Socket | null = null;

// /**
//  * Connect to the Socket.IO server
//  * @param serverUrl - The URL of the Socket.IO server
//  * @returns {Socket} - The connected Socket instance
//  */
// export const connectSocket = (serverUrl: string): Socket => {
//     socket = io(serverUrl);

//     socket.on('connect', () => {
//         console.log('Connected to the socket server');
//     });

//     socket.on('disconnect', () => {
//         console.log('Disconnected from the socket server');
//     });

//     return socket;
// };

// /**
//  * Get the current Socket.IO instance
//  * @returns {Socket | null} - The Socket instance or null if not connected
//  */
// export const getSocket = (): Socket | null => socket;
