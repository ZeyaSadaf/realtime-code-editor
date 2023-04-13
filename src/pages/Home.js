import React, {useState} from 'react'
import '../App.css';
import {v4 as uuidV4} from 'uuid';
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import Codemirror from 'codemirror';
import Editor from '../components/Editor';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");

  const createNewRoom = (e) =>
  {
    e.preventDefault(); //stops the anchor tag from refreshing the page.
    const id = uuidV4().slice(0,8);
    console.log(id);
    setRoomId(id);
    toast.success("New room created!🍻");
  }

  const joinRoom = () =>
  {
    if(!userId||!roomId){
      toast.error("User Id or Room Id not filled 😞!");
    }
    //redirect if both filled using UseNavigate
    if(userId&&roomId){
    navigate(`/editor/${roomId}`, {state : {userId,},});
    }
  };


  const keyPress = (e) =>
  {
    if(e.code === "Enter" &&userId&&roomId){
    joinRoom();}
  };

  return (
    // #191A19
    <div className = "homePageWrapper">
        <div className = "formWrapper">
          <img className = "logoImg" src = "/sync_tax2.png" alt = "logo"></img>
          <h4 className = "MainLabel">Paste Invitation Room ID</h4>
          <div className="inputGroup">
            <input className = "inputBox" type = "text" placeholder="Username" requiured onChange = {(e)=>setUserId(e.target.value)}
            onKeyUp = {keyPress}></input>
            <input className = "inputBox" type = "text" placeholder = "Room ID" required onChange = {(e)=>setRoomId(e.target.value)} value = {roomId}
            onKeyUp = {keyPress}></input>
            <button type = "" onClick = {joinRoom} className = "btn joinBtn">Join</button>
            <span className='createInfo'>Do not have room ID? Create <a onClick = {createNewRoom} href = "/" className = "NewRoomBtn">new room.</a></span>
          </div>
        </div>
        {/* <h4 className = "footer">Inspired by <a href = "/" className="NewRoomBtn">Coder's Gyaan</a></h4> */}
        <h4 className = "footer">A realtime code-editor.</h4>
    </div>
  )
}

export default Home