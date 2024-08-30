import supabaseClient from "../backend/supabase/index.js";

const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const smLogin = document.getElementById("smLogin");
const smLogout = document.getElementById("smLogout");

// const tham = document.querySelector(".tham");

// tham.addEventListener("click", () => {
//   tham.classList.toggle("tham-active");
// });

async function updateAuthButtons() {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    // User is logged in
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
    smLogin.style.display = "none";
    smLogout.style.display = "inline-block";
  } else {
    // User is not logged in
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
    smLogin.style.display = "inline-block";
    smLogout.style.display = "none";
  }
}

updateAuthButtons();

// handle logout
document.getElementById("logout").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
  } else {
    alert("Logout successful!");
    updateAuthButtons();

    // Redirect to a public page if needed
    window.location.href = "/src/pages/Login/index.html";
  }
});

document.getElementById("smLogout").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
  } else {
    alert("Logout successful!");
    updateAuthButtons();

    // Redirect to a public page if needed
    window.location.href = "/src/pages/Login/index.html";
  }
});

// handle login
document.getElementById("login").addEventListener("click", () => {
  window.location.href = "/src/pages/Login/index.html";
});

document.getElementById("smLogin").addEventListener("click", () => {
  window.location.href = "/src/pages/Login/index.html";
});

window.addEventListener("load", updateAuthButtons);

supabaseClient.auth.onAuthStateChange((event, session) => {
  updateAuthButtons();
});
