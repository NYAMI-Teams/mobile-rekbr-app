import { createContext, useContext, useState } from "react";

const AppBootContext = createContext();

export const AppBootProvider = ({ children }) => {
  const [hasBooted, setHasBooted] = useState(false);
  return (
    <AppBootContext.Provider value={{ hasBooted, setHasBooted }}>
      {children}
    </AppBootContext.Provider>
  );
};

export const useAppBoot = () => useContext(AppBootContext);
