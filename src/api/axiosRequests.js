import axios from "axios";

const baseURL = "https://chatmessageapi.onrender.com";
export const signUp = async (data) => {
    const res = await axios.post(baseURL + "/user/signup", data);
    if(!res.data.token){
        return alert(res.data.message);
    }
    localStorage.setItem("token", res.data.token);
}

export const logIn = async (data) => {
    const res = await axios.post(baseURL + "/user/login", data);
    if(!res.data.token){
        return alert(res.data.message);
    }
    localStorage.setItem("token", res.data.token);
}

export const getMessages = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(baseURL + "/api/messages/" + id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const getRoom = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(baseURL + "/api/room/" + id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const getUser = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(baseURL + "/user",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const getRecentRooms = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(baseURL + "/user/recent-rooms",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const deleteRoom = async (roomId) => {
     const token = localStorage.getItem("token");
    const res = await axios.delete(baseURL + "/user/room/" + roomId,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const toggleFavorites = async (roomId) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(baseURL + "/user/toggle-favorite",{ roomId: roomId},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}