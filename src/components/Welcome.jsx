import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/chatIcon.png";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).user_name
    );
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" style={{width:'500px',height:'178px'}} />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3 style={{marginTop:10}}>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #5071fe;
  flex-direction: column;
  
  span {
    color: Gray;
  }
`;
