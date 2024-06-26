import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';
import { host } from "../utils/APIRoutes.js";

function Chat() {

  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrenChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      if(!localStorage.getItem('chat-app-user')){
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        setIsLoaded(true);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    if (currentUser){
      socket.current = io("http://localhost:3003");
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])
  
  useEffect(() => {
    const setUser = async () => {
      if (currentUser){
        if (currentUser.isAvatarImage){
          const allContacts = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(allContacts.data);
        } else {
          navigate("/setavatar")
        }
      }
    }
    setUser()
  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrenChat(chat);
  }

  return (
    <Container>
      <div className='chat-container'>
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
        {
          isLoaded && currentChat && currentUser === undefined ? <Welcome currentUser={currentUser} /> : <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  .chat-container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 2rem;
    @media screen and (min-width: 720px) and (max-width: 1080px){
      grid-template-columns: 35% 65%;
    }
  }
`

export default Chat