import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo.jsx';
import { getMessages, getRoom, getUser } from '../api/axiosRequests.js';
import { useDispatch, useSelector } from 'react-redux';
import { setUserMessages, updateUserMessages , setRoom, setUser} from '../redux/userSlice.js';
import "./chatroom.css"
import { socket } from '../Chat/Chat.jsx';
import Header from '../../components/Header.jsx';
import Spinner from '../../components/Spinner.jsx';
function ChatRoom() {
  const bottomElement = useRef(null);

  const token = localStorage.getItem("token");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value);
  const roomId = params.id;
  const [roomCode, setRoomCode] = useState("");
  const [currentMessage, setCurrentMessage] = useState("")
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(true);

  function scrollToBottom(){
    bottomElement.current?.scrollIntoView({behavior:"smooth", block: "end"})
  }
  useEffect(() => {
    const getAll = async () => {
      await getRoom(roomId).then(data => {
        setRoomCode(data.roomCode)
        socket.emit("join-room", data.roomCode);
        dispatch(setRoom(data))
    })

    await getUser().then(data => {
      dispatch(setUser(data))
    })

    await getMessages(roomId).then(data => {
      dispatch(setUserMessages(data))
    }).then(() => setMessageLoading(false));
    }
    getAll()
  }, [])


  useEffect(() => {
    socket.on("get-message", async (message) => {
      dispatch(updateUserMessages(message));
    })
    
    return () => socket.off("get-message");
  }, [socket])
  
  useEffect(() => {
    scrollToBottom()
  }, [user])


  function produceDate(primitive){
    let year = new Date(primitive).getFullYear();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = new Date(primitive).getDay();
    let month = new Date(primitive).getMonth();
    let hours = new Date(primitive).getHours();
    let minutes = new Date(primitive).getMinutes();

    if(minutes.toLocaleString().length < 2){
      minutes = `0${minutes}`;
    };
    if(hours.toLocaleString().length < 2){
      hours = `0${hours}`;
    };

    return `${hours}:${minutes}, ${months[month]} ${day} ${year}`;
  }
  function sendMessage(){
    socket.emit("send-message", {message: currentMessage, room: roomId, roomCode: roomCode});
    setCurrentMessage("");
  }
  const LogOut = () => {
    localStorage.setItem("token", null);
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div>
      <Header onclick={LogOut} username={user?.user.username}/>
      <div className="chatroom-body">
        <div className="chat-profile">
          <div className="chat-content">
            <h2>{user.room.roomCode || "Room Name"}</h2>
            <p>{roomCode || "roomcode"}</p>
          </div>
          <button onClick={async () => {
            await socket.emit("leave-room", roomCode);
            navigate("/chat");
            }}>
              Leave
          </button>
        </div>
        <div className="messages" style={{position: "relative"}}>
            { messageLoading ? (
              <div style={{display: 'flex',position: "absolute", top: 0, width: "100%", alignItems: "flex-start", marginTop: "30px", justifyContent:"center"}}>
                <Spinner size={30}/>
              </div>
             ) : (
              user?.messages.map((message) => (
                <div className="message-container" key={message._id + Date.now()}>
            <div 
            className={message.author._id == user.user._id ? "message message-mine" : "message"}>
              <div style={{marginBottom: "5px"}}>{message.author.username}</div>
              <p className="content">
                {message.content}
              </p>
              <h5>{produceDate(message.updatedAt)}</h5>
            </div>
          </div>
              ))
            )}
            <div style={{marginTop: "70px"}}></div>
            <div ref={bottomElement}></div>
        
        </div>
        <div className="chatroom-type">
          <input type="text" value={currentMessage} name="" id="" onChange={(e) => setCurrentMessage(e.target.value)}/>
          <button onClick={() => {if(currentMessage != "") {sendMessage()}}}>
              <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24">
              <path d="M5.521,19.9h5.322l3.519,3.515a2.035,2.035,0,0,0,1.443.6,2.1,2.1,0,0,0,.523-.067,2.026,2.026,0,0,0,1.454-1.414L23.989,1.425Z"/><path d="M4.087,18.5,22.572.012,1.478,6.233a2.048,2.048,0,0,0-.886,3.42l3.495,3.492Z"/>
              </svg>

          </button>
          <button className="stb" onClick={() => scrollToBottom()}>
          <svg xmlns="http://www.w3.org/2000/svg" height="40px"  width="30px" viewBox="0 -960 960 960" fill="#40e0d0"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
        </button>
          
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
