import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import { Tooltip } from "@mui/material";
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    // Retrieve the user ID from local storage
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    ).user_id;
    // Log the user out by sending a POST request to the server
    // console.log("Logging out...")

    // Send a POST request to the server with the user ID
    const data = await axios.post(logoutRoute, {
      user_id: id
    });

    if (data.data.error === false) {
      // Clear local storage to log the user out
      localStorage.clear();
      // Redirect the user to the login page
      navigate("/login");
    }
  };
  return (
    <Tooltip title="Logout">
      <Button onClick={handleClick}>
        <BiPowerOff />
      </Button>
    </Tooltip>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: white;
  cursor:pointer;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #f34d4d;
  }
`;
