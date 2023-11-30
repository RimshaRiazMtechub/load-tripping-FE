import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logoApp.jpg";
import { Avatar } from "@mui/material";
import { host } from "../utils/APIRoutes";
import Logout from "./Logout";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserId, setCurrentUserId] = useState(undefined);

  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  // Use the 'useEffect' hook to perform side effects after the component has rendered
  useEffect(async () => {
    // Retrieve user data from local storage
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
     // Set the current user's name, image, and ID using the retrieved data
    setCurrentUserName(data.user_name);
    setCurrentUserImage(data.image);
    setCurrentUserId(data.user_id)


  }, []);
  // Function to change the current chat when a contact is selected
  const changeCurrentChat = (index, contact) => {
     // Set the selected index in the state
    setCurrentSelected(index);
      // Call the 'changeChat' function with the selected contact
    changeChat(contact);

  };


  return (
    <>
      <Container>
        <span style={{padding:'20px'}}>
        <Avatar src={Logo} variant="square" alt="logo" style={{width:'300px',height:'auto'}} />

        </span>
        
        <div className="contacts">
          {contacts.map((contact, index) => {
            return (
              <>
                {currentUserId === contact.user_id ? <>
                </> :
                  <>
                    <div
                      key={contact.user_id}
                      style={{position:'relative'}}
                      className={`contact ${index === currentSelected ? "selected" : ""
                        }`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="avatar">
                        {contact.image === null || contact.image === undefined || contact.image === "" ? <>
                          <Avatar className="avatarStroke" sx={{ bgcolor: 'lightGray',border:'0.5px solid gray'
                         }}
                          >
                            {contact.user_name ? contact.user_name.charAt(0) : ''}
                          </Avatar>

                        </> :
                          <>  <Avatar
                            src={`${host}/${contact.image}`}
                            alt=""
                          />
                          </>}

                      </div>
                      <div className="username">
                        <h3>{contact.user_name}</h3>
                      </div>
                      {contact.unreadMessages===0?<>
                      </>:
                      <> 
                      <div style={{backgroundColor:'rgb(62 197 152)',borderRadius:'50%',position:'absolute',right:0,padding:'5px'}}>
                      <span style={{color:'white'}}>
                      </span>
                      </div>
                      </>}
                    
                    </div> 
                    
                  </>}

              </>
            );
          })}
        </div>
        <div className="current-user">
       <div style={{display:'flex'}}>
          <div className="avatar">
            {currentUserImage === null || currentUserImage === undefined || currentUserImage === "" ? <>
              <Avatar sx={{ bgcolor: '#53bdeb' }} className="avatarStroke" >
                {currentUserName ? currentUserName.charAt(0) : ''}
              </Avatar>
            </> :
              <>   <Avatar
                src={`${host}/${currentUserImage}`}
                alt="avatar"
              />
              </>}

          </div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
       </div>
       <div style={{paddingRight:'10px'}}>

       <Logout />
       </div>
           
         
        </div>
      </Container>
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  overflow: hidden;
  border-radius:20px 0px 0px 20px;
  background-color: white;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 2rem;
      width: 7rem;
    }
  }
  .avatarStroke{
    color:black;
    text-transform: uppercase;
   

  }
  .contacts {
    display: flex;
    margin-top:10px;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: transparent;
      border-bottom:1px solid lightGray;
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
          border:1px solid lightGray;
          border-radius:50%;

        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
    .selected {
      background-color: #f0f2f5;
    }
  }

  .current-user {
    background-color: #5071fe;
    border-top:0.5px solid lightGray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    
    }
    .avatar {
      padding-left:10px;
      img {
        height: 4rem;
        max-inline-size: 100%;
       
        border-radius:50%;
      }
    }
    .username {
      h2 {
        color: white;
        padding-top:5px;
        padding-left:10px;
      }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
