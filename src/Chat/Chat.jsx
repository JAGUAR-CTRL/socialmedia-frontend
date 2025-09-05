import React, {useEffect, useState} from 'react'
import "./chat.css"
import {io }from "socket.io-client"
import Logo from "./../../components/Logo.jsx";
import ModalSpinner from "./../../components/ModalSpinner.jsx";
import Spinner from "./../../components/Spinner.jsx";
import {useDispatch, useSelector} from "react-redux";
import { deleteSetRoom, setRecentRooms, setUser} from '../redux/userSlice.js';
import { increaseAge } from '../redux/userSlice.js';
import favoriteTrue from "./../assets/favorite_true.svg";
import deleteIcon from "./../assets/trash.svg";
import favoriteFalse from "./../assets/favorite_false.svg";
import {useNavigate} from "react-router-dom";
import { getRecentRooms , getUser, toggleFavorites, deleteRoom} from '../api/axiosRequests.js';
import Header from '../../components/Header.jsx';
// const socket = io("http://localhost:6500", {
//   transports: ["websocket"], 
// });

const socketURL = "https://chatmessageapi.onrender.com";
const token = localStorage.getItem("token")
export const socket = io(socketURL, {
   transports: ["websocket"],
   auth: {
    token: token
   }
 });
function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  const [message, setMessage] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isEnteringRoom, setIsEnteringRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [loadingRecentRooms, setLoadingRecentRooms] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  useEffect(() => {
    getRecentRooms().then(async (data) => {
      await dispatch(setRecentRooms(data));
      setLoadingRecentRooms(false);
    })
     getUser().then(data => {
          dispatch(setUser(data))
        });
    socket.on("get-room", ({roomId})=> {
      setPageLoading(prev => prev = false);
      if(roomId){
        navigate(`/chat/${roomId}`);
      }
    })
   socket.on("error", ({message})=> {
      setPageLoading(prev => prev = false);
      setMessage(message);
    })
    socket.on("noroom", ({message}) => {
      setPageLoading(prev => prev = false);
      setMessage(message);
    })
     return () => {
      socket.off("no-room");
        socket.off("error");
      socket.off("get-room");
    }
  }, []);
  

    function enterRoom(){
      if(isEnteringRoom){
        setPageLoading(true);
        socket.emit("enter-room", {room: roomCode})
      }
    }
    function createRoom(){
      if(isCreatingRoom){
        setPageLoading(false);
        socket.emit("create-room", {room: roomCode})

      }
    }
     const LogOut = () => {
      localStorage.setItem("token", null);
      localStorage.removeItem("token");
      navigate("/");
    }

  return (
    <div>
      {pageLoading ? <ModalSpinner/> : null}
      <div className="chat">
        <Header onclick={LogOut} username={user?.user.username}/>
        <div className="alert-message-container">
          <span>{message}</span>
        </div>
        <div className="chat-body">
        <div className="enter-room">
          <h3>Enter a Room</h3>
          <input type="text"  onChange={(e) => {
            e.target.value.length < 0.5 ?
              (setIsEnteringRoom(prev => prev = false)):
              (setIsEnteringRoom(prev => prev = true));
              setRoomCode(e.target.value)
          }
            }
            disabled={isCreatingRoom ? true : false}/>
          <button type='submit' id="enter-room"
          onClick={() => enterRoom() }
           style={{ backgroundColor: isEnteringRoom ? "turquoise" : "grey"}}
          >Enter Room</button>
        </div>
        <div className="create-room">
          <h3>Create a Room</h3>
          <input type="text" onChange={(e) => {
            e.target.value.length < 0.5 ?
            (setIsCreatingRoom(prev => prev = false)):
             (setIsCreatingRoom(prev => prev = true));
             setRoomCode(e.target.value);
            }}
             disabled={isEnteringRoom ? true : false}/>
          <button type='submit' id='create-room' onClick={() => createRoom()}
          style={{backgroundColor: isCreatingRoom ? "turquoise" : "grey"}}>
            Create Room
            </button>
        </div>
        </div>
        <div className="recentlyEntered">
          <h2>Recent Rooms</h2>
          <div className="rooms">
            {loadingRecentRooms ? (
              <div style={{display: 'flex', alignItems: "center", justifyContent: "center", marginTop:"100px"}}>
                <Spinner size={40}/>
              </div>) : (
              user?.recentRooms.map((room, index) => {
                return (
            <div className="room-container" key={room._id}>
             <span className='index'>{index + 1}</span>
              <div className="room">
                <div className="room-content" onClick={() => {
                    setPageLoading(true);
                    socket.emit("enter-room", {room: room.roomCode})
              }}>
                  <div className="room-name">{room.roomCode}</div>
                  <div className="room-code">{room.roomCode}</div>
                </div>
                <div className='buttons'>
                  <button className="favorite-button" onClick={()=> {
                    toggleFavorites(room._id).then(data => {
                      dispatch(setRecentRooms(data));
                    })
                    }}>
                    <img id="toggle" src={room.favorites.includes(user?.user._id) ? favoriteTrue : favoriteFalse} alt="" />
                  </button>
                  <button
                  
                  
                  style={{display: room.creator == user?.user._id ? "inline-block": "none"}} 
                  className="delete-button" onClick={()=> {
                    const confirmation = window.confirm(`Are you sure you want to delete the room: ${room.roomCode}`)
                    if(confirmation){
                      dispatch(deleteSetRoom({id: room._id}));
                      deleteRoom(room._id).then(data => {
                         dispatch(setRecentRooms(data))
                      })
                    }
                    }}>
                        <img src={deleteIcon} alt="" />
                  </button>
                </div>
              </div>
            </div>
              )})
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
