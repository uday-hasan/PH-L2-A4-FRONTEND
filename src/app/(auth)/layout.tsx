import Navbar from "@/components/shared/Navbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <div
        style={{
          height: "calc(100vh - 64px)",
        }}
        className="w-full  border-4 flex items-center justify-center"
      >
        {children}
      </div>
    </div>
  );
};

export default layout;
