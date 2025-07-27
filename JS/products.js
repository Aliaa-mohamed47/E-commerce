// File: products.js - Display products - Fatma & Rawan

// go to top btn
let BackToTop = document.getElementById("backToTop")
BackToTop.onclick = () => {
    window.scrollTo ({
        top: 0,
        behavior: "smooth",
    })
}
window.onscroll = () => {
  if (window.scrollY > 300) {
    BackToTop.style.display = "block";
  } else {
    BackToTop.style.display = "none";
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

 

// --------------------------------------------------------------------------------------------------------------------------------
// product details

// quantity button
function increaseValue() {
  const increase = document.getElementById("quantityInput");
  increase.value = parseInt(increase.value) + 1;
}

function decreaseValue() {
  const decrease = document.getElementById("quantityInput");
  if (parseInt(decrease.value) > 1) {
    decrease.value = parseInt(decrease.value) - 1;
  }
}


// changing product details pictures & border color
function changeMainImage(clickedImg) {
  document.getElementById('mainImage').src = clickedImg.src;
  const x = document.querySelectorAll('.smallImg');
  x.forEach(div => div.classList.remove('selected'));
  clickedImg.parentElement.classList.add('selected');
}

