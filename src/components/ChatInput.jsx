import React, { useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { GrAdd } from "react-icons/gr"
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg, imagePicker }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    // Toggle the visibility of the emoji picker
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    // Append the selected emoji to the message input
    let message = msg;
    message += emojiObject.emoji;
    // console.log("emoji")
    // console.log(message)

    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      // Call the handleSendMsg function to send the message
      handleSendMsg(msg);
      setMsg("");
    }
  };
  // Image picker 
  const inputRef = useRef(null);

  const handleClick = () => {
    // Open the file input box when another element is clicked
    inputRef.current.click();
  };
  const onFileChange1 = (e) => {
    // Call the imagePicker function to handle the selected image
    imagePicker(e)
  }
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />

          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>

      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }} >
        <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }}
          onChange={(e) => onFileChange1(e.target.files[0])} />
        <GrAdd style={{ cursor: 'pointer' }} onClick={handleClick} />
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>

        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />

        <button type="submit">
          <IoMdSend />
        </button>


      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items: center;
  grid-template-columns: 10% 100%;
  background-color: #f0f2f5;
  border-top:1px solid lightGray;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    flex-direction:row;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position:relative;
      svg {
        font-size: 1.5rem;
        color: gray;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content:space-between;
    gap: 4rem;
    background-color: white;
    input {
      width: 90%;
      height: 40px;
      background-color: transparent;
      color: black;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      display: flex;
      cursor:pointer;
      justify-content: center;
      align-items: center;
      background-color: #f0f2f5;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: gray;
      }
    }
  }
`;


