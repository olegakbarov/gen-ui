"use client";

import { AlexanderTheGreatBio } from "@/prompts";
import { SchemaName } from "@/schemas";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

// Define the shape of our state
interface GlobalState {
  schemaName: SchemaName;
  text: string;
}

// Define the shape of our actions
type Action =
  | { type: "SET_SCHEMA_NAME"; payload: SchemaName }
  | { type: "SET_TEXT_DATA"; payload: string };

// Create a context with an initial undefined value
const GlobalStateContext = createContext<
  { state: GlobalState; dispatch: Dispatch<Action> } | undefined
>(undefined);

// Define initial state
const initialState: GlobalState = {
  schemaName: "Timeline",
  text: AlexanderTheGreatBio,
};

// Define reducer function
function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case "SET_SCHEMA_NAME":
      return { ...state, schemaName: action.payload };
    case "SET_TEXT_DATA":
      return { ...state, text: action.payload };
    default:
      return state;
  }
}

// Define props for the provider component
interface GlobalStateProviderProps {
  children: ReactNode;
}

// Create the provider component
export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// Custom hook to use the global state
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
