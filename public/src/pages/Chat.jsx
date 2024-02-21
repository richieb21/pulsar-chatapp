import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';

function Chat() {

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      if(!localStorage.getItem('chat-app-user')){
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
      }
    }

    getUser();
  }, [])
  
  useEffect(() => {
    const setUser = async () => {
      console.log(currentUser)
      if (currentUser){
        console.log(currentUser.isAvatarImage)
        if (currentUser.isAvatarImage){
          console.log("THERE IS AN IMAGE HERE")
          const allContacts = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log(allContacts.data);
          setContacts(allContacts.data);
        } else {
          navigate("/setavatar")
        }
      }
    }

    setUser()
  }, [currentUser])


  const clearStorage = () => {
    console.log("Hi")
    localStorage.removeItem('chat-app-user');
    navigate("/login");
  }

  return (
    <Container>
      <div className='chat-container'>
        <Contacts contacts={contacts} currentUser={currentUser}/>
      </div>
      <button onClick={clearStorage}>Log out</button>
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