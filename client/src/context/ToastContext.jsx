import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FavoritesProvider } from "./FavoritesContext.jsx";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);

  const notify = (nextMessage) => {
    window.clearTimeout(timeoutRef.current);
    setMessage(nextMessage);
    timeoutRef.current = window.setTimeout(() => setMessage(""), 3200);
  };

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <FavoritesProvider>
      <ToastContext.Provider value={notify}>
        {children}
        <AnimatePresence>
          {message && (
            <motion.div
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </ToastContext.Provider>
    </FavoritesProvider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
