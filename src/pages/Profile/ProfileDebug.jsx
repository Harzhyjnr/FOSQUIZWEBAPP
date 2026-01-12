import React from "react";

const ProfileDebug = () => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        color: "#000",
      }}
    >
      <h1>Profile Page - Debug</h1>
      <p>If you can see this, the page is rendering!</p>
      <p>User from localStorage: {localStorage.getItem("user")}</p>
    </div>
  );
};

export default ProfileDebug;
