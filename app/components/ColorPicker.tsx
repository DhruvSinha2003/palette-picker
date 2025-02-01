"use client";

import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import tinycolor from "tinycolor2";

type Suggestions = {
  secondaryColor: string;
  lightBackground: string;
  darkBackground: string;
  accentColor: string;
  analogousColor: string;
};

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState<string>("#aabbcc");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const getSuggestions = (primary: string): Suggestions => {
    let primaryColor = tinycolor(primary);
    if (
      primaryColor.getBrightness() > 240 ||
      primaryColor.getBrightness() < 15
    ) {
      return {
        secondaryColor: primaryColor.isLight() ? "#666666" : "#bbbbbb",
        lightBackground: primaryColor.isLight() ? "#f5f5f5" : "#333333",
        darkBackground: primaryColor.isLight() ? "#cccccc" : "#111111",
        accentColor: "#ff8c00",
        analogousColor: "#888888",
      };
    }

    const secondaryColor = primaryColor.complement().toHexString();
    const analogousColors = primaryColor.analogous();
    const accentColor =
      analogousColors && analogousColors[1]
        ? tinycolor(analogousColors[1]).toHexString()
        : primaryColor.spin(40).toHexString();
    const lightBackground = primaryColor.lighten(25).toHexString();
    const darkBackground = primaryColor.darken(25).toHexString();
    const analogousColor =
      analogousColors && analogousColors[2]
        ? tinycolor(analogousColors[2]).toHexString()
        : primaryColor.spin(-40).toHexString();

    return {
      secondaryColor,
      lightBackground,
      darkBackground,
      accentColor,
      analogousColor,
    };
  };

  const suggestions = getSuggestions(color);

  useEffect(() => {
    const primaryColor = tinycolor(color);
    const gradientLight = primaryColor.lighten(35).toHexString();
    const gradientDark = primaryColor.darken(35).toHexString();
    document.body.style.background = `linear-gradient(135deg, ${gradientLight} 0%, ${gradientDark} 100%)`;
  }, [color]);

  useEffect(() => {
    const leftContainer = document.querySelector(".left");
    if (leftContainer) {
      leftContainer.setAttribute(
        "style",
        `background-color: ${color}; 
         transition: background-color 0.5s;`
      );
    }
  }, [suggestions.accentColor]);

  const getContrastingTextColor = (bgColor: string) => {
    return tinycolor(bgColor).isLight() ? "#000" : "#fff";
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      showToast(`Copied ${value} to clipboard`);
    });
  };

  const HexDisplay: React.FC<{ hex: string }> = ({ hex }) => {
    return (
      <button
        onClick={() => handleCopy(hex)}
        style={{
          border: "none",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          fontSize: "inherit",
          textDecoration: "underline",
        }}
      >
        {hex}
      </button>
    );
  };

  return (
    <div className="container">
      <div className="left">
        <HexColorPicker color={color} onChange={setColor} />
        <p
          className="selected"
          style={{ color: getContrastingTextColor(color) }}
        >
          Selected Color: <HexDisplay hex={color} />
        </p>
      </div>
      <div
        className="suggestions"
        style={{
          backgroundColor: suggestions.lightBackground,
          color: getContrastingTextColor(suggestions.lightBackground),
        }}
      >
        <div className="suggestion">
          <div
            className="color-box"
            style={{
              backgroundColor: suggestions.secondaryColor,
              cursor: "pointer",
            }}
            onClick={() => handleCopy(suggestions.secondaryColor)}
          ></div>
          <p>
            Secondary Color: <HexDisplay hex={suggestions.secondaryColor} />
          </p>
        </div>
        <div className="suggestion">
          <div
            className="color-box"
            style={{
              backgroundColor: suggestions.lightBackground,
              cursor: "pointer",
            }}
            onClick={() => handleCopy(suggestions.lightBackground)}
          ></div>
          <p>
            Light Background: <HexDisplay hex={suggestions.lightBackground} />
          </p>
        </div>
        <div className="suggestion">
          <div
            className="color-box"
            style={{
              backgroundColor: suggestions.darkBackground,
              cursor: "pointer",
            }}
            onClick={() => handleCopy(suggestions.darkBackground)}
          ></div>
          <p>
            Dark Background: <HexDisplay hex={suggestions.darkBackground} />
          </p>
        </div>
        <div className="suggestion">
          <div
            className="color-box"
            style={{
              backgroundColor: suggestions.accentColor,
              cursor: "pointer",
            }}
            onClick={() => handleCopy(suggestions.accentColor)}
          ></div>
          <p>
            Accent Color: <HexDisplay hex={suggestions.accentColor} />
          </p>
        </div>
        <div className="suggestion">
          <div
            className="color-box"
            style={{
              backgroundColor: suggestions.analogousColor,
              cursor: "pointer",
            }}
            onClick={() => handleCopy(suggestions.analogousColor)}
          ></div>
          <p>
            Analogous Color: <HexDisplay hex={suggestions.analogousColor} />
          </p>
        </div>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
};

export default ColorPicker;
