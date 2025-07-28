// fetching 3 products in home page
if (window.location.pathname.includes("index.html")) {
fetch("https://ecommerce.routemisr.com/api/v1/products")
  .then(response => response.json())
  .then(data => {
  const allProducts = data.data;

  const menProducts = allProducts.filter(product =>
  product.category.name.toLowerCase() === "men's fashion"
  );
  const twoMenProducts = menProducts.slice(0, 2);
  const womenProduct = allProducts.find(product =>
  product.category.name.toLowerCase() === "women's fashion"
  );
  const selectedProducts = [...twoMenProducts, womenProduct];
   
  const productCards = document.querySelectorAll(".products");
  selectedProducts.forEach((product, index) => {
  const card = productCards[index];
  const img = card.querySelector("img");
  const title = card.querySelector("h5");
  const price = card.querySelector("p");
  const button = card.querySelector(".viewDetails");

  img.src = product.imageCover;
  title.textContent = product.title;
  price.textContent = `EGP ${product.price}`;
   button.onclick = () => {
     console.log(product._id);
        window.location.href = `product.html?id=${product._id}`;
      };
  });
  })
  .catch(error => {
    console.error("Error fetching products:", error);
  });
}