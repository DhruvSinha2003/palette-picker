// app/page.tsx
import React from "react";
import ColorPicker from "./components/ColorPicker";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ColorPicker />
    </div>
  );
};

export default HomePage;
