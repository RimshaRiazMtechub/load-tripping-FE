import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, chatRoomCreate, getChatRoom, getUserByUniqIdONE, host, readMessagesRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ContactsListToselect from "../components/ContactsListToSelect";
import { Typography } from "@mui/material";

export default function ChatList() {
  const navigate = useNavigate();
  const socket = useRef();
  const { user1, user2, loadid } = useParams();
  const encodedUser1 = encodeURIComponent(user1);
const encodedUser2 = encodeURIComponent(user2);
const encodedLoadId = encodeURIComponent(loadid);
  // Import necessary dependencies and hooks
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [Chatselected, setChatSelected] = useState(false);
  const [SelectedContact, setSelectedContact] = useState([]);
  const [open, setOpen] = useState(true)
  // Function to handle changing the current chat
  const handleChatChange = async (chat) => {
    setCurrentChat(chat);
    setChatSelected(true)
    // Mark messages as read between the current user and the selected chat
    await axios.post(`${readMessagesRoute}`, {
      from_user: chat.user_id,
      to_user: currentUser.user_id
    });
    // Fetch the updated list of contacts
    const data1 = await axios.post(`${getUserByUniqIdONE}`, {
      uniq_id: chat.uniq_id
    });

    setSelectedContact(data1.data.result);

  };
  // Initial data fetching on component load
  useEffect(() => {
    async function fetchData() {
      // If user data is not found in local storage, navigate to the login page
      // if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      //   navigate("/login");
      // } else {
      // Set the current user using the data from local storage
      // console.log("Data")

      // api to create chat room 
      const { data } = await axios.post(chatRoomCreate, {
        uniq_id: encodedLoadId,
        user1: encodedUser1,
        user2: encodedUser2,
      });
      // console.log(data)

      if (data.error === true) {

      } else {
        let Data = {
          user1: encodedUser1,
          user2: encodedUser2,
          uniq_id: encodedLoadId,
          currentUser: encodedUser1,
          chat_room_id: data.data[0].chat_room_id

        }
        setCurrentChat(data.data[0].chat_room_id)
        // console.log(Data)
        setCurrentUser(encodedUser1)
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(Data)
        );

      }


      // setCurrentUser(
      //   await JSON.parse(
      //     localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      //   )
      // );
      
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Connect to the WebSocket server and add the current user
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser);
    }
  }, [currentUser]);

  // Fetch the initial list of contacts and set up WebSocket event listeners
  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        const data = await axios.post(`${getChatRoom}`, {
          loadId: encodedLoadId,
        });
        setOpen(false);
        // console.log("Load Data")

        // console.log(data)
        // Set the contacts to the fetched list
        // setContacts(data.data.result);
      }
    }

    fetchData();

    // WebSocket event listeners
  //   if (socket.current) {
  //     const messageListener = async (msg) => {
  //       // Fetch the updated list of contacts when a new message arrives
  //       const data = await axios.post(`${allUsersRoute}`, {
  //         user_id: msg.user_id,
  //       });
  //       setOpen(false);
  //       setContacts(data.data.result);
  //     };
  //     // Attach the message listener to the WebSocket
  //     socket.current.on("unread-messages-updated", messageListener);
  //     // Return a cleanup function to remove the message listener
  //     return () => {
  //       socket.current.off("unread-messages-updated", messageListener);
  //     };
  //   }
  }, [currentUser]);


  return (
    <>
      <Container>
        {open ? <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </> :
          <>
              <div className="container">

                {/* <ContactsListToselect contacts={contacts} changeChat={handleChatChange}/> */}
                {/* <Contacts contacts={SelectedContact} changeChat={handleChatChange} /> */}
                {/* {currentChat === undefined ? (
                  <Welcome />
                ) : ( */}
                  <ChatContainer  socket={socket} />
                 {/* )}  */}
              </div>
          </>}

      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
 
  background-color: #cde9f5;
  .container {
    
    height: 95vh;
    width: 95vw;
    border-radius:20px;
    background-color: #f0f0f0;
    display: grid;
    grid-template-columns: 100%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 100%;
    }
  }
`;
