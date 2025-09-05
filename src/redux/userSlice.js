import {createSlice} from "@reduxjs/toolkit";

const initialValue = {
    user: [],
    room: {},
    messages: [],
    recentRooms: []
}

const userSlice = createSlice({
    name: "user",
    initialState: {value: initialValue},
    reducers: {
        userDetails: (state, action) => {
            state.value = action.payload
        },
        setUserMessages: (state, action) => {
            state.value.messages = action.payload;
        },
        updateUserMessages: (state, action) => {
            state.value.messages = [...state.value.messages, action.payload];
        },
        setRoom: (state, action) => {
            state.value.room = action.payload;
        },
        setUser: (state, action) => {
            state.value.user = action.payload;
        },
        setRecentRooms: (state, action) => {
            state.value.recentRooms = action.payload;
        },
        changeFavoritesValue: (state, action) => {
            let userId = state.value.user._id;
            let room = state.value.recentRooms.find(r => r._id == action.payload.id)

           if(!room) return;
            if(room.favorites.includes(userId)){
                room.favorites = room.favorites.filter((favId) => {
                    favId !== userId;
                })
            }else{
                room.favorites.push(userId);
            }
        },
        deleteSetRoom: (state, action) => {
            let userId = state.value.user._id;
            let room = state.value.recentRooms;

            if(!room) return;
            room = room.filter((value) => {
                return value._id !== action.payload.id;
            })          
        }
    }
})

export const userDetails =  userSlice.actions.userDetails;
export const increaseAge =  userSlice.actions.increaseAge;
export const setRoom =  userSlice.actions.setRoom;
export const setUser =  userSlice.actions.setUser;
export const setRecentRooms =  userSlice.actions.setRecentRooms;
export const deleteSetRoom =  userSlice.actions.deleteSetRoom;

export const changeFavoritesValue = userSlice.actions.changeFavoritesValue;
export const setUserMessages =  userSlice.actions.setUserMessages;
export const updateUserMessages =  userSlice.actions.updateUserMessages;


export default userSlice.reducer;