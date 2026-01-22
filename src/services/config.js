// Centralized runtime configuration for the frontend.
// You can override these via Vite env variables.

// Example (development):
//   VITE_API_BASE_URL=/api
//   VITE_BACKEND_BASE_URL=http://localhost:8080
// Example (ngrok):
//   VITE_API_BASE_URL=https://xxxx.ngrok-free.app/api
//   VITE_BACKEND_BASE_URL=https://xxxx.ngrok-free.app

export const API_BASE_URL = "http://localhost:8080/api";

// Used for serving uploaded files like /uploads/**
export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'https://parker-unstigmatized-eleanor.ngrok-free.dev';
