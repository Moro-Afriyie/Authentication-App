export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://authentication-app-api-kb1s.onrender.com";

export const ICONS = {
  INFO: "info",
  SUCCESS: "check_circle",
  CLOSE: "close",
};
