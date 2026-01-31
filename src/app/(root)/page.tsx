import HomePage from "@/components/home/Home";
import React from "react";

const page = () => {
  return (
    <div>
      {/* <HomePage isLoggedIn={true} userRole="admin" userName="Admin User" /> */}
      {/* <HomePage isLoggedIn={true} userRole="seller" userName="Jane Smith" /> */}
      <HomePage isLoggedIn={true} userRole="customer" userName="John Doe" />
    </div>
  );
};

export default page;
