// File: products.js - Display products - Fatma & Rawan

// go to top btn
let btn = document.getElementById("backToTop")
btn.onclick = () => {
    window.scrollTo ({
        top: 0,
        behavior: "smooth",
    })
}
window.onscroll = () => {
  if (window.scrollY > 300) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};


// subscribe form validation
const form = document.getElementById("subscribeForm");
const emailInput = document.getElementById("emailInput");
const emailMessage = document.getElementById("emailMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();      // prevent refresh after clicking 'submit'
  const email = emailInput.value.trim();
  const valid = email.includes("@") && email.includes(".com");
  if (email == "") {
    emailMessage.textContent = "Please enter your email.";
    emailMessage.style.color = "red";
  } else if (!valid) {
    emailMessage.textContent = "Enter a valid email.";
    emailMessage.style.color = "red";
  } else {
    emailMessage.textContent = "Thank you for subscribing!";
    emailMessage.style.color = "#1ca429ff";
    emailInput.value = "";    // ba3d ma ye3mel submit yeshel el email
  }
  setTimeout(() => {
      emailMessage.textContent = "";
    }, 4000);
});
