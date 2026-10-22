"use client";
import { createContext, useContext } from "react";

export const SiteActionsContext = createContext(null);

export function useSiteActions() {
  return useContext(SiteActionsContext) || {};
}
