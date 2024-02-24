import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, currentUser, changeChat }) {

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser){
        setCurrentUserImage(currentUser.avatarImage);
        setCurrentUserName(currentUser.username);
    }
  }, [currentUser, contacts]);

  const changeCurrentChat = (index, contact) => {
    console.log("click!");
    console.log(index);
    setCurrentSelected(index);
    changeChat(contact);
  }

  return (
    <>
        {currentUserImage && currentUserName && (
            <Container>
                <div className='brand'>
                    <img src={Logo} alt="Pulsar" />
                    <h3>Pulsar</h3>
                </div>
                <div className='contacts'>
                    {
                        contacts.map((contact, index) => {
                            return (
                                <div className={`contact ${index === currentSelected ? "selected" : ""}`} key={index} onClick={() => changeCurrentChat(index, contact)}>
                                    <div className='avatar'>
                                        <div className='avatar-image' dangerouslySetInnerHTML={{ __html: contact.avatarImage }} />
                                    </div> 
                                    
                                    <div className='username'>
                                        <h3>{contact.username}</h3>
                                    </div> 
                                </div>   

                            )
                        })
                    }
                </div>
                <div className="current-user">
                    <div className="avatar">
                        <div dangerouslySetInnerHTML={{ __html: currentUserImage }} />
                    </div>
                    <div className="username">
                        <h3>{currentUserName}</h3>
                    </div>
                </div>
            </Container>
        )}
    </>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 15% 75% 10%;
    overflow: hidden;
    background-color: #080420;
    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        img {
            height: 2rem;
        }
        h3 {
            color: white;
            text-transform: uppercase;

        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #FFFFFF39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            display: flex;
            align-items: center;
            background-color: #FFFFFF39;
            min-height: 5rem;
            width: 90%;
            cursor: pointer;
            border-radius: 0.2rem;
            padding: 0.4rem;
            gap: 1rem;
            transition: 0.2s ease-in-out;
            .avatar {
                svg {
                    height: 3rem;
                    width: 3rem;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9186f3;
        }
    }
    .current-user {
        background-color: #0d0d30;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        svg {
            height: 3.5rem;
            max-inline-size: 100%;
        }
        .username {
            h3 {
                color: white;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px){
            gap: 0.5rem;
            h3 {
                font-size: 1rem;
            }
        }
    }
`;
