
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { AuthProvider } from "./app/context/AuthContext.tsx";
import { preloadExchangeRate } from "./app/utils/currencyConverter.ts";
import "./styles/index.css";

// Preload exchange rate for better performance
preloadExchangeRate().catch(console.warn);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>    <App />
  </AuthProvider>
);  