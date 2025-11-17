"use client";
import { create } from "zustand";

interface EconSimState {
  baseline: {
    growth: number;
    inflation: number;
    confidence: number;
  };
  proposed: {
    growth: number;
    inflation: number;
    confidence: number;
  };
  updateBaseline: (data: Partial<EconSimState["baseline"]>) => void;
  updateProposed: (data: Partial<EconSimState["proposed"]>) => void;
}

export const useEconSimState = create<EconSimState>((set) => ({
  baseline: { growth: 2, inflation: 3.5, confidence: 75 },
  proposed: { growth: 3, inflation: 3.2, confidence: 82 },
  updateBaseline: (data) =>
    set((state) => ({ baseline: { ...state.baseline, ...data } })),
  updateProposed: (data) =>
    set((state) => ({ proposed: { ...state.proposed, ...data } })),
}));
