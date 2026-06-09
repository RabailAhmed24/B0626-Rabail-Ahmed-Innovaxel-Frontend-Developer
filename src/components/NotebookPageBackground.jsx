import React from "react";

export default function NotebookPageBackground({ children }) {
  return (
    <div
      className="min-h-screen w-full relative antialiased overflow-x-hidden"
      style={{
        backgroundColor: "#fbfaf5", // Soft warm premium off-white paper base
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(235, 232, 222, 0.04) 0px, rgba(235, 232, 222, 0.04) 1px, transparent 1px, transparent 10px)
        `,
      }}
    >
      {/* Horizontal Ruled Lines only - Keeping it ultra minimal */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 27px,
              #dfe4ea 27px, 
              #dfe4ea 28px
            )
          `,
          opacity: 0.5,
        }}
      />

      {/* Subtle Shadow Depth for Paper Aesthetic */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0) 98%, rgba(0, 0, 0, 0.003) 100%)
          `
        }}
      />

      {/* Main Container Layout */}
      {/* Adjusted padding: Now balanced perfectly relative to the dark sidebar */}
      <div className="relative z-10 w-full min-h-screen p-6 pl-28 pr-6 md:pr-10">
        {children}
      </div>
    </div>
  );
}