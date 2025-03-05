document.addEventListener("DOMContentLoaded", function () {
  const swiperContainer = document.querySelector(".swiper-wrapper");

  // Llenamos el swiper con los productos
  const fillSwiper = (products) => {
    products.forEach((product) => {
      const productCard = createProductCard(product);
      swiperContainer.appendChild(productCard);
    });
  };

  // Hacemos un fetch de 10 productos para mostrar en el slider
  fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=10")
    .then((response) => response.json())
    .then((products) => {
      fillSwiper(products);

      // Inicializamos el swiper
      new Swiper(".swiper", {
        loop: true,
        direction: "horizontal",
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    });
});

// Funcion para crear la card de cada producto
const createProductCard = (product) => {
  console.log(product);
  const productCard = document.createElement("div");
  productCard.classList.add("swiper-slide");
  productCard.innerHTML = `
      <div class="swiper-content-products">
        <h2 class="swiper-title-products">${product.title}</h2>
        <p class="swiper-price-products">$${product.price}</p>
      </div>
      <div class="swiper-image-products">
        <img src="${product.images[0]}" alt="${product.title}">
      </div>
    `;
  return productCard;
  // No he añadido el precio tachado porque no lo he encontrado en la API
};
