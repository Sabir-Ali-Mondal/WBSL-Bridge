import * as THREE from "three";

// Three.js r183+ deprecated THREE.Clock in favor of THREE.Timer, and r184+ deprecated
// PCFSoftShadowMap in favor of PCFShadowMap. While upstream ecosystems like @react-three/fiber
// transition their internal defaults, suppress these specific deprecation warnings
// cleanly using Three.js's built-in console hook and browser console filter.

if (typeof (THREE as any).setConsoleFunction === "function") {
  (THREE as any).setConsoleFunction((type: string, message: string, ...params: any[]) => {
    if (
      typeof message === "string" &&
      (message.includes("Clock: This module has been deprecated") ||
        message.includes("PCFSoftShadowMap has been deprecated"))
    ) {
      return;
    }
    if (type === "warn") {
      console.warn(message, ...params);
    } else if (type === "error") {
      console.error(message, ...params);
    } else {
      console.log(message, ...params);
    }
  });
}

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const first = typeof args[0] === "string" ? args[0] : "";
    if (
      first.includes("Clock: This module has been deprecated") ||
      first.includes("PCFSoftShadowMap has been deprecated")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
