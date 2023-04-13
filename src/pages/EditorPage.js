import React, {useEffect, useRef, useState} from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import toast from "react-hot-toast";
import '../App.css';
import { initSocket } from '../socket';
import Happyhappy from './Happyhappy.mp3';

const EditorPage = () => {

  const socketRef = useRef(null);
  const audioRef = useRef(null); 
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);  
  const { roomId } = useParams();


   // create a ref for the audio element
  console.log(`Room ID ---------------> ${roomId}`);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play(); // play the audio file
    }
  }, [audioRef]);

  useEffect(() =>{
    const init = async () =>
    {
      // try{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      const handleErrors = (e) => 
      {
        console.log(`Socket error: ${e}`);
        toast.error("Socket connection failed, please try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN,
        {
          roomId, 
          userId: location.state?.userId,
          
        }
        );

      //Listening for Joined event
      socketRef.current.on(ACTIONS.JOINED, ({clients, userId, socketId}) =>
      {
        if(userId !== location.state?.userId){
          toast.success(`${userId} has joined the room successfully!`);
          console.log(`${userId} has joined the room successfully!`);
          if (audioRef.current) {
            audioRef.current.play(); // play the audio file
          }
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code:codeRef.current,
          socketId,
        });
        
      });
          //listeing for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, userId}) =>
      {
        toast.success(`${userId} left the room.`);
        setClients((prev) =>
        {
          return prev.filter((client) => client.socketId!==socketId)
        });
      });
  
    // }


   
    // catch(error)
    // {
    //   console.error("Failed to connect to server:", error);
    //     }
    };
    init();

    //clearing events => cleaning functions
    return () =>
    {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

    }
  }, []);


  //Copy ID
  async function copyRoomId()
  {
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch(err)
    {
      console.log("Error:------>",err);
      toast.error("Could not copy room ID :(");
    }
  }

//Leave room 
  async function leaveRoom()
  {
    try{
      reactNavigator("/");
      toast.error("Left the room.");
    } catch(err)
    {
      console.log("Error:------>",err);
      toast.error("Could not leave :(");
    }
  }

  if(!location.state)
  {
    return <Navigate to = "/" />;
  }

  return (
    <div className = "mainWrap">
      {/* <audio ref={audioRef} src={Happyhappy} /> */}
      <div className = "aside">
        <div className = "asideInner">
          <div className = "logo">
            <Link to = '/'>
            <img className = "editorLogo" src = "/sync_tax2.png" alt = "logo"></img>
            </Link>
          {/* <hr></hr> */}
          </div>
          <h3>Connected 🟢</h3>
          <div className='clientList'>
            {clients.map((client) =>(<Client key = {client.socketId} 
            userId = {client.userId}/>))}
          </div>
        </div>

        <button className='btn copyRoom' onClick={copyRoomId}>Copy Room Id</button>
        <button className='btn leaveRoom' onClick={leaveRoom}>Leave</button>
      </div>
      <div className = "editorWrap">
      <Editor socketRef = {socketRef} roomId = {roomId} onCodeChange={(code) =>
      {
        codeRef.current = code;
      }} />
      </div>
    </div>
  )
}

export default EditorPage