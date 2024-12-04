import supabaseClient from "../backend/supabase/index.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Error:", error.message);
    alert("Login failed. Please check your credentials and try again.");
  } else {
    // Redirect on successful login
    window.location.href = "/src/pages/Products/index.html";
  }
});
