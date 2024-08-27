import supabaseClient from "../backend/supabase/index.js"
        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            const { data, error } = await supabaseClient.auth.signUp({ email, password ,username});
            if (error) {
                console.error('Signup Error:', error.message);
                alert('Signup failed. Please try again.');
            } else {
                await supabaseClient.from('users').insert([{ username, email,password }]);
                window.location.href = '/src/pages/Login/index.html';
            }

           
        });
