import Navbar from "@/components/shared/Navbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <Navbar />
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"> */}
      {children}
      {/* </div> */}
    </div>
  );
};

export default layout;
