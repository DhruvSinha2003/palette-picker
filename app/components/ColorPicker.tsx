// app/components/ColorPicker.tsx
"use client";

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState<string>("#aabbcc");

  const getComplementaryColors = (color: string): string[] => {
    const complement1 =
      "#" +
      (Number(`0x1${color.slice(1)}`) ^ 0xffffff)
        .toString(16)
        .slice(1)
        .toUpperCase();
    const complement2 =
      "#" +
      (Number(`0x2${color.slice(1)}`) ^ 0xffffff)
        .toString(16)
        .slice(1)
        .toUpperCase();
    return [complement1, complement2];
  };

  const complementaryColors = getComplementaryColors(color);

  return (
    <div className="flex flex-col items-center">
      <HexColorPicker color={color} onChange={setColor} />
      <p className="mt-4 text-lg">{color}</p>
      <div className="mt-4 flex space-x-4">
        {complementaryColors.map((compColor, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16" style={{ backgroundColor: compColor }} />
            <p className="mt-2">{compColor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
