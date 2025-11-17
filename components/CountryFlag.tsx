'use client';
import React from 'react';

/**
 * Displays a country flag using flag-icons.
 * @param code - Two-letter country code (ISO 3166-1 alpha-2)
 * Example: 'us', 'gb', 'in', 'cn', etc.
 */
export default function CountryFlag({ code }: { code: string }) {
  if (!code) return null;

  return (
    <span
      className={`fi fi-${code.toLowerCase()} mr-2`}
      style={{
        display: 'inline-block',
        width: '18px',
        height: '12px',
        borderRadius: '2px',
        boxShadow: '0 0 2px rgba(0,0,0,0.25)',
      }}
    ></span>
  );
}
