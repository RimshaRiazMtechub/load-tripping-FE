import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/logoApp.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserOTPUniqID, updateUsernameRoute, verifyEmailRoute } from "../utils/APIRoutes";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import ReactInputVerificationCode from "react-input-verification-code";
export default function VerificationOTP() {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false)
  const [loadingStateUserName, setLoadingStateUserName] = useState(false)
  const [disableUserButton, setdisableUserButton] = useState(true)
  const [values, setValues] = useState({
    email: "",
  });
  const [userName, setUserName] = useState('')
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [open, setOpen] = useState(false)
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

        toast.success("Verification OTP has been send to your email ", toastOptions);

      }

    } else {
      setLoadingState(false)

    }
  };
  const { uniq_id } = useParams()
  const [OTPData, setOTPData] = useState('')
  const [ResultData, setResultData] = useState('')
  const saveUser = async () => {
    // console.log("StateResult")
    setdisableUserButton(false)

    setLoadingStateUserName(true)
    // API CALL TO UPDATE AND NAVIGATE 
    const { data } = await axios.post(updateUsernameRoute, {
      user_name: userName,
      user_id: ResultData.user_id
    });
    // console.log(data)
    if (data.error === true) {
      toast.error(data.message, toastOptions);
      setLoadingStateUserName(false)

    } else {
      // console.log("data")
      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(data.data[0])
      );
      navigate('/')

    }

  }
  const saveUserName = async () => {
    // console.log("StateResult")


    // API CALL TO UPDATE AND NAVIGATE 
    const { data } = await axios.post(getUserOTPUniqID, {
      uniq_id: uniq_id,

    });
    // console.log("UERS HD")

    // console.log(data)
    // check user expiry token 
    // Your given date and time string
    const expiryDateString = data.result.otpExpires;

    // Parse the given date string into a Date object
    const expiryDate = new Date(expiryDateString);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the two dates to check if the expiry date has passed
    if (currentDate > expiryDate) {
      // console.log("The expiry date has passed.");
      navigate(`/login`)
    } else {
      // console.log("The expiry date has not passed yet.");
      setOTPData(data.result.otp)
      setResultData(data.result)
    }

  }
  useEffect(() => {
    toast.success("Verification OTP has been send to your email ", toastOptions);
    // api to get user otp by uniq_id 
    saveUserName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [UserEnteredotpValue, setUserEnteredOtpValue] = useState('')

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
          </div>
          <Typography variant="h5">
            Enter OTP to verify your Email Address
          </Typography>
          <div className="custom-styles">


            <ReactInputVerificationCode
              placeholder=''
              // style={{borderRadius:'20px'}}
              value={UserEnteredotpValue}
              length={6}
              onChange={(e) => setUserEnteredOtpValue(e)}
              classNames={{
                container: "container",
                character: "character",
                characterInactive: "character--inactive",
                characterSelected: "character--selected",
              }}
              autoFocus
            />
          </div>
          <LoadingButton className="buttonClass" loading={loadingState}
            onClick={() => {
              setLoadingState(true)
              // console.log("Verification")
              if (parseInt(OTPData) === parseInt(UserEnteredotpValue)) {
                if (ResultData.user_name === "" || ResultData.user_name === null || ResultData.user_name === undefined) {
                  setOpen(true)
                } else {
                  localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(ResultData)
                  );
                  navigate("/");
                }
              } else {
                setLoadingState(false)
                toast.error("Invalid OTP", toastOptions)
              }
            }}>
            Verify
          </LoadingButton>
        </form>
        {/* Dialog for userName  */}
        <Dialog
          maxWidth="md"
          open={open}
        // onClose={handleClose}
        >
          <DialogTitle>Set your name  </DialogTitle>
          <DialogContent>
            <TextField
              name="user_name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value)
                if (e.target.value.length === 0) {
                  setdisableUserButton(true)
                } else {
                  setdisableUserButton(false)

                }

              }}
              sx={{ width: '100%', marginTop: '10px' }} id="outlined-basic"
              label="Name"
              variant="outlined" />
            <LoadingButton
              style={
                {
                  padding: "0.5rem 2rem",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  borderRadius: "0.4rem",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  marginTop: 20, width: '100%', backgroundColor: "#5e84fc", color: 'white'
                }}
              loading={loadingStateUserName} disabled={disableUserButton}
              onClick={() => saveUser()}>
              Save
            </LoadingButton>
          </DialogContent>

        </Dialog>
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
  .character {
    border: 1px solid lightgrey;
    font-size: 12px;
    border-radius: 8px;
    font-weight: 600;
    color: #272729;
    background-color: #f6f5fa;
    box-shadow: none;
  
  }
  .custom-styles {
    --ReactInputVerificationCode-itemWidth: 3.5rem;
    --ReactInputVerificationCode-itemHeight: 3.5rem;
  }
 
`;
