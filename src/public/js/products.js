const addCartButtons = document.querySelectorAll(".product__addCart");
let cartId = sessionStorage.getItem("cartId");

addCartButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(cartId);
    let productId = e.target.parentNode.getAttribute("data-product-id");
    try {
      if (!cartId) {
        let response = await fetch("/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            products: [
              {
                product: productId,
                quantity: 1,
              },
            ],
          }),
        });
        let data = await response.json();
        cartId = data.payload._id;
        sessionStorage.setItem("cartId", data.payload._id);
      } else {
        let response = await fetch(
          `/api/carts/${cartId}/products/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: 2 }),
          },
        );
        let data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  });
});
