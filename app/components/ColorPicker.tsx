"use client"; // Add this line at the top

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

  // Function to show toast message
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  // New color suggestion algorithm:
  const getSuggestions = (primary: string): Suggestions => {
    let primaryColor = tinycolor(primary);

    // If color is too light or too dark, adjust the suggestions
    if (primaryColor.getBrightness() > 240 || primaryColor.getBrightness() < 15) {
      // Fallback palette
      return {
        secondaryColor: primaryColor.isLight() ? "#666666" : "#bbbbbb",
        lightBackground: primaryColor.isLight() ? "#f5f5f5" : "#333333",
        darkBackground: primaryColor.isLight() ? "#cccccc" : "#111111",
        accentColor: "#ff8c00", // A fixed vibrant accent
        analogousColor: primaryColor.isLight() ? "#888888" : "#888888",
      };
    }

    const secondaryColor = primaryColor.complement().toHexString();
    // Using analogous colors for a richer palette
    const analogousColors = primaryColor.analogous();
    // For accent we pick one of the analogous hues if available
    const accentColor =
      analogousColors && analogousColors[1]
        ? tinycolor(analogousColors[1]).toHexString()
        : primaryColor.spin(40).toHexString();
    // For a bit more depth, we calculate a monochromatic variant
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

  // Update body background gradient and left container background
  useEffect(() => {
    const primaryColor = tinycolor(color);
    // Increase contrast for background gradient by stretching the dark/light values
    const gradientLight = primaryColor.lighten(35).toHexString();
    const gradientDark = primaryColor.darken(35).toHexString();

    document.body.style.background = `linear-gradient(135deg, ${gradientLight} 0%, ${gradientDark} 100%)`;
  }, [color]);

  useEffect(() => {
    // Update left container accent background directly to accent suggestion.
    // We query the element because the styles are outside of React's scope.
    const leftContainer = document.querySelector(".left");
    if (leftContainer) {
      leftContainer.setAttribute(
        "style",
        `background-color: ${suggestions.accentColor}; 
         transition: background-color 0.5s;`
      );
    }
  }, [suggestions.accentColor]);

  // Helper to determine contrasting text color for readability
  const getContrastingTextColor = (bgColor: string) => {
    return tinycolor(bgColor).isLight() ? "#000" : "#fff";
  };

  // Copy to clipboard utility
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      showToast(`Copied ${value} to clipboard`);
    });
  };

  // Component to render a clickable hex value
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
        <p className="selected">
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
            Light Background:{" "}
            <HexDisplay hex={suggestions.lightBackground} />
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
            Analogous Color:{" "}
            <HexDisplay hex={suggestions.analogousColor} />
          </p>
        </div>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
};

export default ColorPicker;
