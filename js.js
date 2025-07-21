 const cards = document.querySelectorAll('.col, .col-4');

  cards.forEach((card, index) => {
    const original = card.innerHTML;

    card.addEventListener('click', function () {
      card.style.backgroundColor = 'black';
      card.style.color = 'white';
      card.innerHTML = `
        <div class="d-flex flex-column align-items-center">
          <button class="btn btn-dark accordion mb-5 mt-5"  onclick="restoreCard(event, ${index})">back</button>
          <button class="btn btn-dark accordion"  onclick="goToPage(event)">view Details➡️ </button>
        </div>
      `;
    });

    card.dataset.original = original;
  });

  function restoreCard(e, index) {
    e.stopPropagation();
    const cards = document.querySelectorAll('.col, .col-4');
    const card = cards[index];
    card.style.backgroundColor = '';
    card.style.color = '';
    card.innerHTML = card.dataset.original;
  }

  function goToPage(e) {
    e.stopPropagation();
    window.location.href = "product.html"; // عدّله حسب الصفحة المستهدفة
  }
  card.style.setProperty('background-color', 'black', 'important');
card.style.setProperty('color', 'white', 'important');

