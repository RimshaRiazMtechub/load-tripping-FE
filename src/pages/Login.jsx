import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logoApp.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  verifyEmailRoute } from "../utils/APIRoutes";
import { LoadingButton } from "@mui/lab";
import {  TextField } from "@mui/material";
export default function Login() {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false)
  const [values, setValues] = useState({
    email: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  

  // const handleChange = (event) => {
  //   setValues({ ...values, [event.target.name]: event.target.value });
  // };
  // valid email 
  function isValidEmail(email) {
    // Regular expression for a valid email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
  const validateForm = () => {
    const { email } = values;
    if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.", toastOptions);
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingState(true)
    if (validateForm()) {
      const { email } = values;
      const { data } = await axios.post(verifyEmailRoute, {
        email,
      });
      // console.log(data)
      if (data.error === true) {
        toast.error(data.message, toastOptions);
        setLoadingState(false)

      } else {
        // console.log("Data ")
        // console.log(data)
        setLoadingState(false)

        navigate(`/verificationOTP/${data.data.uniq_id}`)
      }

    } else {
      setLoadingState(false)

    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
          </div>
          {/* <TextField
            name="email"
            onChange={(e) => handleChange(e)}
            sx={{ width: '100%' }} id="outlined-basic"
            label="Email"
            variant="outlined" />

          <LoadingButton className="buttonClass" loading={loadingState}
            type="submit">
            Login
          </LoadingButton> */}
        </form>
      
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #f1efef;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 4rem;
    }
    h1 {
      color: black;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #ffffff;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border-radius: 0.4rem;
    color: black;
    width: 100%;
    font-size: 1rem;
    &:focus {
      outline: none;
    }
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
  span {
    color: black;
    text-transform: uppercase;
    a {
      color: #53bdeb;
      text-decoration: none;
      font-weight: bold; 
      &:hover{
        color: #99cde3;
    }
    }
   
  }
 
`;
