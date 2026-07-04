"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '100px',
          padding: '16px 24px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 500,
        },
        success: {
          style: {
            background: '#047857', // emerald-700
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#047857',
          },
        },
        error: {
          style: {
            background: '#b91c1c', // red-700
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#b91c1c',
          },
        },
      }}
    />
  );
}
