import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';


const Chat = () => {
    const [message, setMessage] = useState("")
    const [socket, setSocket] = useState("")

/*     useEffect(() => {
        const newSocket = io('http://localhost:5353');

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });
    
        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    
        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    
        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket)

        return () => {
            newSocket.disconnect(); // Esto desconectará el socket cuando el componente se desmonte
        };
    }, []); */

    const sendMessage = async (e) => {
        try {
            e.preventDefault();
            console.log("mensaje enviado");
            if (message && socket) {
                console.log("entra aca");
                socket.emit('chat message', message);
                setMessage('');
            }
        } catch (error) {
            console.error('Error', error);
        }
    };
  return (
    <div>
        <form id="chatForm" encType="multipart/form-data" onSubmit={sendMessage}>
            <input type="text" placeholder='Insert text' id="message" value={message} onChange={e => setMessage(e.target.value)}/>
            <button type='submit'>Send</button>
        </form>
    </div>
  )
}

export default Chat