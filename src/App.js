import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import VerificationOTP from "./pages/VerificationOTP";
import ChatList from "./pages/ChatList";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat/:user1/:user2/:loadid" element={<ChatList />} />
        <Route path="/verificationOTP/:uniq_id" element={<VerificationOTP />} />

      </Routes>
    </BrowserRouter>
  );
}
