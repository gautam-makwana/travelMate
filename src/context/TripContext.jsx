import { createContext, useContext, useState } from "react";

const TripContext = createContext();

export function TripProvider({ children }) {
  const [tripPlanned, setTripPlanned] = useState(false);

  return (
    <TripContext.Provider value={{ tripPlanned, setTripPlanned }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  return useContext(TripContext);
}
