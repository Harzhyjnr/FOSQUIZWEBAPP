import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ensureDefaultAdmin, ensureSampleQuestions } from "./utils/storage";

// Theme
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const fonts = {
  body: `'Roboto', sans-serif`,
  heading: `'Roboto', sans-serif`,
};
const theme = extendTheme({
  colors,
  fonts,
  config: { initialColorMode: "light", useSystemColorMode: false },
});

// Load Google Fonts
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Render
// Ensure default admin account exists (email: admin@science.edu password: Admin@123)
ensureDefaultAdmin();
// Ensure there are a few sample questions for initial testing
ensureSampleQuestions();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
