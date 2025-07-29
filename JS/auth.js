document.addEventListener('DOMContentLoaded', () => {
  const sign_in_btn = document.querySelector("#sign-in-btn-custom");
  const sign_up_btn = document.querySelector("#sign-up-btn-custom");
  const container = document.querySelector(".containerr");

  if (sign_up_btn && sign_in_btn && container) {
    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
  
    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }

  function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  // Register
  const registerForm = document.getElementById('registerForm');
  const messageDiv = document.getElementById('registerMessage');

  if (registerForm && messageDiv) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = registerForm.querySelector('input[name="name"]').value.trim();
      const email = registerForm.querySelector('input[name="email"]').value.trim();
      const password = registerForm.querySelector('input[name="password"]').value;
      const rePassword = registerForm.querySelector('input[name="rePassword"]').value;

      if (password !== rePassword) {
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'Passwords do not match.';
        return;
      }

      if (!validatePassword(password)) {
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'Password must be at least 8 characters long, include a number, a capital letter, and a special character.';
        return;
      }

      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, rePassword })
        });

        const data = await response.json();

        if (response.ok) {
          messageDiv.style.display = 'block';
          messageDiv.className = 'alert alert-success';
          messageDiv.textContent = '✅ Registered successfully!';
          registerForm.reset();
          setTimeout(() => { window.location.href = "login-register.html"; }, 1000);
        } else {
          let errorMsg = data.message || 'Registration failed';
          if (data.errors) {
            const errorsArray = Object.values(data.errors).map(err => err.message);
            errorMsg = errorsArray.join(' | ');
          }
          messageDiv.style.display = 'block';
          messageDiv.className = 'alert alert-danger';
          messageDiv.textContent = errorMsg;
        }
      } catch (error) {
        console.error('Error:', error);
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'Something went wrong!';
      }
    });
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  const loginMessageDiv = document.getElementById('loginMessage');

  if (loginForm && loginMessageDiv) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;

      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log(data);

        
        if (response.ok) {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userName', data.user.name);
          loginMessageDiv.style.display = 'block';
          loginMessageDiv.className = 'alert alert-success';
          loginMessageDiv.textContent = '✅ Logged in successfully!';
          loginForm.reset();
          setTimeout(() => { window.location.href = "index.html"; }, 1000);
        } else {
          let errorMsg = data.message || 'Login failed';
          loginMessageDiv.style.display = 'block';
          loginMessageDiv.className = 'alert alert-danger';
          loginMessageDiv.textContent = errorMsg;
        }
      } catch (error) {
        console.error('Error:', error);
        loginMessageDiv.style.display = 'block';
        loginMessageDiv.className = 'alert alert-danger';
        loginMessageDiv.textContent = 'Something went wrong!';
      }
    });
  }

  // Forgot Password
  const forgotForm = document.getElementById('forgotForm');
  const forgotMessageDiv = document.getElementById('forgotMessage');

  if (forgotForm && forgotMessageDiv) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = forgotForm.querySelector('input[type="email"]').value.trim();

      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
          forgotMessageDiv.style.display = 'block';
          forgotMessageDiv.className = 'alert alert-success';
          forgotMessageDiv.textContent = '✅ Code sent to your email!';
          localStorage.setItem('resetEmail', email);
          setTimeout(() => { window.location.href = "OTP.html"; }, 1000);
        } else {
          forgotMessageDiv.style.display = 'block';
          forgotMessageDiv.className = 'alert alert-danger';
          forgotMessageDiv.textContent = data.message || 'Something went wrong';
        }
      } catch (error) {
        console.error('Error:', error);
        forgotMessageDiv.style.display = 'block';
        forgotMessageDiv.className = 'alert alert-danger';
        forgotMessageDiv.textContent = 'Something went wrong!';
      }
    });
  }

  // OTP Verification
  const verifyForm = document.getElementById('verifyForm');
  const verifyMessageDiv = document.getElementById('verifyMessage');

  if (verifyForm && verifyMessageDiv) {
    verifyForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const resetCode = verifyForm.querySelector('input[name="resetCode"]').value.trim();

      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resetCode })
        });

        const data = await response.json();

        if (response.ok) {
          verifyMessageDiv.style.display = 'block';
          verifyMessageDiv.className = 'alert alert-success';
          verifyMessageDiv.textContent = '✅ Code verified!';
          localStorage.setItem('resetCode', resetCode);
          setTimeout(() => { window.location.href = "reset-password.html"; }, 1000);
        } else {
          verifyMessageDiv.style.display = 'block';
          verifyMessageDiv.className = 'alert alert-danger';
          verifyMessageDiv.textContent = data.message || 'Invalid code';
        }
      } catch (error) {
        console.error('Error:', error);
        verifyMessageDiv.style.display = 'block';
        verifyMessageDiv.className = 'alert alert-danger';
        verifyMessageDiv.textContent = 'Something went wrong!';
      }
    });
  }

  // Reset Password
  const resetForm = document.getElementById('resetForm');
  const resetMessageDiv = document.getElementById('resetMessage');

  if (resetForm && resetMessageDiv) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newPassword = resetForm.querySelector('input[name="newPassword"]').value;
      const confirmPassword = resetForm.querySelector('input[name="confirmPassword"]').value;

      if (newPassword !== confirmPassword) {
        resetMessageDiv.style.display = 'block';
        resetMessageDiv.className = 'alert alert-danger';
        resetMessageDiv.textContent = 'Passwords do not match';
        return;
      }

      try {
        const email = localStorage.getItem('resetEmail');
        const resetCode = localStorage.getItem('resetCode');

        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword, resetCode })
        });

        const data = await response.json();

        if (response.ok) {
          resetMessageDiv.style.display = 'block';
          resetMessageDiv.className = 'alert alert-success';
          resetMessageDiv.textContent = '✅ Password changed successfully!';
          setTimeout(() => { window.location.href = "login-register.html"; }, 1000);
        } else {
          resetMessageDiv.style.display = 'block';
          resetMessageDiv.className = 'alert alert-danger';
          resetMessageDiv.textContent = data.message || 'Something went wrong';
        }
      } catch (error) {
        console.error('Error:', error);
        resetMessageDiv.style.display = 'block';
        resetMessageDiv.className = 'alert alert-danger';
        resetMessageDiv.textContent = 'Something went wrong!';
      }
    });
  }
});

