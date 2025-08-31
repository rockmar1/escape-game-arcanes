import { GameState } from "./gameState.js";
import { endGame } from "./router.js";

const ADMIN_HASH = "5f4dcc3b5aa765d61d8327deb882cf99"; // "password" MD5

function md5(str) {
  return CryptoJS.MD5(str).toString();
}

export function initAdmin() {
  const panel = document.getElementById("admin-panel");
  const loginBtn = document.getElementById("admin-login");

  loginBtn.addEventListener("click", () => {
    const input = document.getElementById("admin-pass").value;
    if (md5(input) === ADMIN_HASH) {
      document.getElementById("admin-tools").classList.remove("hidden");
      console.debug("[DEBUG] Accès admin validé");
    } else {
      alert("Mot de passe incorrect");
    }
  });

  document.getElementById("admin-force-win").addEventListener("click", () => {
    endGame(true);
  });

  document.getElementById("admin-force-lose").addEventListener("click", () => {
    endGame(false);
  });

  document.getElementById("admin-debug").addEventListener("click", () => {
    GameState.debug = !GameState.debug;
    alert("Mode Debug : " + (GameState.debug ? "ON" : "OFF"));
  });
}
