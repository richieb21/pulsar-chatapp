import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import multiavatar from '@multiavatar/multiavatar';
import { setAvatarRoute } from '../utils/APIRoutes';
import axios from 'axios';

function SetAvatar() {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
        navigate("/login");
    }
  }, [])

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
        toast.error("Please select an avatar", toastOptions);
    } else {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar]
        });

        if (data.isSet){
            user.isAvatarImage = true;
            user.avatarImage = avatars[selectedAvatar];
            localStorage.setItem('chat-app-user', JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
        }
    }
  }

  useEffect(() => {
    (async () => {
      const data = [];
      try {
        for (let i = 0; i < 4; i++) {
          const svg = multiavatar(Math.round(Math.random() * 10000));
          data.push(svg);
        }
        setAvatars(data);
      } catch (error) {
        console.error("Failed to fetch avatars:", error);
        toast.error("Failed to load avatars. Please try again later.", toastOptions);
      }
      setIsLoading(false);
    })();
  }, []);

  const refreshAvatars = async () => {
    const data = [];
    try {
      for (let i = 0; i < 4; i++) {
        const svg = multiavatar(Math.round(Math.random() * 10000));
        data.push(svg);
      }
      setAvatars(data);
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
      toast.error("Failed to load avatars. Please try again later.", toastOptions);
    }
    setIsLoading(false);
  }


  return (
    <>
      <Container>
        <div className='title-container'>
          <h1>Set your Avatar</h1>
        </div>
        <div className='avatars'>
          {avatars.map((avatar, index) => (
            <div key={index} 
                 className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                 onClick={() => setSelectedAvatar(index)}>
              <div dangerouslySetInnerHTML={{ __html: avatar }} />
            </div>
          ))}
        </div>
        <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
        <button className='submit-btn' onClick={refreshAvatars}>Refresh</button>
        <ToastContainer/>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
        color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
        border: 0.4rem solid transparent;
        padding: 0.4rem;
        border-radius: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: ease-in-out 0.25s;
        svg {
            width: 6rem;
            height: 6rem;
        }
    }
    .selected {
        border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: ease-in-out 0.25s;
    &:hover {
        background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
