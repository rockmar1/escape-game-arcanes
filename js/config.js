export const GameConfig = {
  TIME_START: 600,
  DEBUG: true, // bascule le debug
  ADMIN_HASH: "73f4e6aa83d143e69a8059d0f04b6d9a83e8e0e6c6a0c7b40b1f96a4ee9b0a12" // SHA-256 de "magie2025"
};
export function log(...args){ if(GameConfig.DEBUG) console.log("[DBG]",...args); }
