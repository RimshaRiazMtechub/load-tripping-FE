import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  sendMessageRoute,
  recieveMessageRoute,
  uploadImageRoute,
  host
} from "../utils/APIRoutes";
import { Avatar, Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import TimeFormat from "../utils/TimeFormat";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

export default function ChatContainer({ socket }) {
  const scrollRef = useRef();
  const navigate=useNavigate()
  // States 
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState('');

  const [submitLoader, setsubmitLoader] = useState(false);
  const [imageFiles, setImageFiles] = useState('')
  const [imageSelected, setImageSelected] = useState('')
  const [open, setOpen] = useState(true)
  const [loadingState, setloadingState] = useState(false)
  //  Send Messages 
  const handleSendMsg = async (msg) => {
    // Retrieve user data from local storage
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    // Update messages in the state with the new message
    const msgs = [...messages];
    msgs.push({ from_self: true, message: msg, type: "text" });
    setMessages(msgs);

    // Emit a message to the socket server
    socket.current.emit("send-msg", {
      to: currentChat,
      from: data.currentUser,
      msg,
      type: "text",
      load_id:data.uniq_id
    });
    // Scroll to the new message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // Send the message to the server
    const response = await axios.post(sendMessageRoute, {
      from_user: data.currentUser,
      to_user: currentChat,
      message: msg,
      type: "text",
      load_id:data.uniq_id
    });
  };

  //  Send Image Files 
  const handleImageFiles = (imagesUrls) => {
    // console.log("ImageUrls", imagesUrls)
    setImageSelected(imagesUrls)
    const urlObject = URL.createObjectURL(imagesUrls)
    setImageFiles(urlObject)

  }
  // submit Image 
  const submitImage = async () => {
    // Set the selected image and its URL
    setsubmitLoader(true)
    // Create a form data object and append the selected image
    var bodyFormData = new FormData();
    bodyFormData.append('image', imageSelected);
    // Upload the image to the server
    axios({
      method: "post",
      url: uploadImageRoute,
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data"
      },
    })
      .then(async function (response) {
        const msg = response.data.path
        // Update messages in the state with the new image
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        const msgs = [...messages];
        msgs.push({ from_self: true, message: msg, type: "image" });
        setMessages(msgs);
        // Emit a message to the socket server
        socket.current.emit("send-msg", {
          to: currentChat,
          from: data.currentUser,
          msg,
          type: "image",
          load_id:data.uniq_id
        });
        // Send the image message to the server
        const response1 = await axios.post(sendMessageRoute, {
          from_user: data.currentUser,
          to_user: currentChat,
          message: msg,
          type: "image",
          load_id:data.uniq_id

        });
        // Clear the selected image and loader
        setImageFiles('')
        setImageSelected('')
        setsubmitLoader(false)
        // Scroll to the new message
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });

      })
      .catch(function (response) {
        //handle error
      });


  }
  const FetchToUserChat = (currentChat) => {
    // console.log("Current chat ")
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    // console.log(currentChat)
    // console.log(data)

    if (data.currentUser === data.user1) {
      setCurrentChat(data.user2)
    } else {
      setCurrentChat(data.user1)

    }



  }
  // On Page Refresh 

  useEffect(() => {
    FetchToUserChat();
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    // Fetch messages from the server
    const fetchData = async () => {
      console.log("currentChat")

      console.log(currentChat)
      console.log(data.uniq_id)
      console.log(data.currentUser)


      try {
        const response = await axios.post(recieveMessageRoute, {
          from_user: data.currentUser,
          to_user: currentChat,
          load_id:data.uniq_id

        });

        if (response.data.error === true) {
          // console.log("Not Getting Messages");
          setOpen(false);
        } else {
          setMessages(response.data.data);
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            setOpen(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();
    // socket 
    // console.log('socket.current')

    // console.log(socket.current)
    if (socket.current) {
      const messageListener = (msg) => {
        // Handle incoming messages from the socket server
        // // console.log("msg")
        // // console.log(msg)
        // // update messages 
        console.log("chat", msg.user_id)
        console.log("chat2", currentChat)


        if (msg.user_id === currentChat) {
          console.log("match")
          console.log(msg)
          const arrivalMessages1 = {
            from_self: false, message: msg.msg, type: msg.type, user_id: msg.user_id,

          }
          // Update the messages in the state
          setMessages((prev) => [...prev, arrivalMessages1])

          scrollRef.current?.scrollIntoView({ behavior: "smooth" });

        } else {
          console.log(" not match")
        }
        // Emit a message to the server to mark messages as read
        console.log(data.currentUser)
        socket.current.emit("update-unread-messages", {
          user_id: data.currentUser,
        });
      };

      socket.current.on("msg-recieve", messageListener);

      return () => {
        // Remove the message listener when the component unmounts
        socket.current.off("msg-recieve", messageListener);
      };
    }

  }, [currentChat]);
  return (
    <Container>
      {
        open ? <>
          <div style={{ backgroundColor: 'white', position: 'absolute', bottom: '20%', left: '50%', padding: 5, borderRadius: 50 }}>
            <CircularProgress color="inherit" />
          </div>
        </> :
          <>
          </>
      }

      <div className="chat-header">
        <div className="user-details">
          {/* <div className="avatar">
            {currentChat.image === null || currentChat.image === undefined || currentChat.image === "" ? <>
              <Avatar className="avatarStroke" sx={{ bgcolor: "lightGray", border: '0.5px solid gray' }}
              >
                {currentChat.user_name ? currentChat.user_name.charAt(0) : ''}
              </Avatar>
            </> :
              <>
                <Avatar style={{ border: '0.5px solid lightGray' }}
                  src={`${host}/${currentChat.image}`}
                  alt=""
                />
              </>}

          </div>
          <div className="username">
            <h3>{currentChat.user_name}</h3>
          </div> */}
        </div>
        <div>
          <LoadingButton className="buttonClass" loading={loadingState}
            onClick={() => {
              setloadingState(true)
              // window.location.reload()
              navigate('/login')
            }}>
            Back
          </LoadingButton>
        </div>

      </div>
      {/* Messages */}
      {imageFiles.length === 0 ? <>
        <div className="chat-messages">
          {/* {loading && <div>Loading...</div>} */}
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                {
                  message.type === "text" ? <>

                    <div
                      className={`message ${message.from_self === true ? "sended" : "recieved"
                        }`}

                    >
                      <div className="content ">
                        <p style={{ marginBottom: '25px' }}>{message.message}</p>
                        <div style={{ position: 'absolute', marginTop: '10px', bottom: 0, right: 20, color: 'white', display: 'flex', justifyContent: 'right' }}>
                          {/* <Typography paragraph >
                        {DateFormat(message.created_at)}
                        </Typography> */}
                          <Typography paragraph>
                            {TimeFormat(message.created_at)}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </> :
                    <>
                      <div
                        className={`message ${message.from_self === true ? "sended" : "recieved"
                          }`}

                      >
                        <div className="content">
                          <Avatar style={{ width: '200px', height: '200px', marginBottom: '25px' }} variant="square" src={`${host}/${message.message}`} alt="image" />
                          <div style={{ position: 'absolute', marginTop: '10px', bottom: 0, right: 20, color: 'white', display: 'flex', justifyContent: 'right' }}>
                            {/* <Typography paragraph >
                        {DateFormat(message.created_at)}
                        </Typography> */}
                            <Typography paragraph>
                              {TimeFormat(message.created_at)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </>
                }

              </div>
            );
          })}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} imagePicker={handleImageFiles} />
      </> :
        <>
          {/* Images selected  */}
          <div style={{ margin: '10px' }}>
            <div style={{ position: 'absolute', top: "15%", right: 20 }}>
              <Tooltip title="close">
                <CloseIcon style={{ cursor: 'pointer' }} onClick={
                  () => setImageFiles('')
                } />
              </Tooltip>

            </div>
            <div style={{ marginTop: '40px', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img alt="" style={{ width: "33%", height: 'auto', cursor: 'pointer', backgroundColor: 'white' }}
                src={imageFiles} />
            </div>

            <div style={{ padding: '5px', position: "absolute", bottom: "7%", right: '50%' }}>
              <Button className="submitButton" onClick={() => submitImage()} size="large" variant="contained" disabled={submitLoader} endIcon={submitLoader ? <CircularProgress color="inherit" size={20} /> : <SendIcon style={{ fontSize: '20px' }} />}>
                Send
              </Button>
            </div>
          </div>
        </>}

    </Container>
  );
}

const Container = styled.div`
  display: grid;
  position:relative;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  border-radius:20px;

  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .avatarStroke{
    color:black;
    text-transform: uppercase;

  }
  .chat-header {
    background-color:#f0f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    border-bottom:1px solid lightGray;
    .user-details {
      display: flex;
      align-items: center;
  
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
          border-radius:50%;
          margin-top:2px;
        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    background-color:#f0f0f0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #4f4f4f;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    
    &.sended {
      justify-content: flex-end;
      .content {
        position:relative;
        min-width:150px;

        color:white;
        background-color: #5071fe !important;
      }
      
    }
    &.recieved {
      justify-content: flex-start !important;
      .content {
        position:relative;
        min-width:150px;
  
        color:white;
        background-color: #2c2471 !important;
      }
    }
  }
}
  .imageAdd{
    background-color:white;
  }
  .close-icon {
    display: none;
  }
  .close-icon.show {
    display: block; 
  }
  .imageAdd:hover{
    background-color:lightGray;
  }
  .submitButton {
    background-color:#53bdeb;
    position:relative;
    width:110%;
    display: flex;
    font-weight:600;
    justify-content: center;
    align-items: center;
    cursor:pointer;
    border-radius:20px;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0.3rem 1rem;
      svg {
        font-size: 1rem;
      }
    }
    svg {
      font-size: 2rem;
      color: white;
    }
  }
  .submitButton:hover{
    border:none;
  }
  .buttonClass {
    background-color: #5e84fc;
    color: white;
    padding: 0.5rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #99cde3;
    }
  }
`;




