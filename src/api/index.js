import axios from "axios";

// Bestimme die Basis-URL basierend auf der Umgebung (lokal oder auf dem Server)
let baseURL;
if (process.env.NODE_ENV === "development") {
  // Lokale Entwicklungsumgebung (z.B. http://localhost:8080)
  baseURL = "http://localhost:8080/api";
} else {
  // Produktionsumgebung (Server)
  const isHttps = window.location.protocol === "https:";
  baseURL = isHttps
    ? "https://lyra.et-inf.fho-emden.de:20032"
    : "http://lyra.et-inf.fho-emden.de:19032";
}

const API = axios.create({
  baseURL: baseURL,
});

export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = async (token, date) =>
  await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = async (token, data) =>
  await API.post(`/user/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });