document.addEventListener("DOMContentLoaded", () => {
  console.log("JS загружен");

  // 👉 Telegram init (ДОБАВИЛ)
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    console.log("INIT DATA:", tg.initDataUnsafe);
    console.log("USER:", tg.initDataUnsafe?.user);
  }

  const listPage = document.getElementById("listPage");
  const productPage = document.getElementById("productPage");
  const price = document.getElementById("price");
  const title = document.getElementById("title");
  const desc = document.getElementById("desc");
  let cart = [];
  let currentProductId = null;
  const cartPage = document.getElementById("cartPage");

  if (!listPage || !productPage || !cartPage || !title || !desc || !price) {
    console.error("❌ Один из элементов не найден");
    return;
  }

  window.openProduct = function(id) {
    currentProductId = id;

    listPage.style.display = "none";
    productPage.style.display = "block";

    if (id === 1) {
      title.innerText = "Товар 1";
      price.innerText = "100";
      desc.innerText = "Описание товара 1";
    } else {
      title.innerText = "Товар 2";
      price.innerText = "200";
      desc.innerText = "Описание товара 2";
    }
  };

  window.goBack = function() {
    productPage.style.display = "none";
    cartPage.style.display = "none";
    listPage.style.display = "block";
  };

  window.buy = function() {
    const product = {
      id: currentProductId,
      title: title.innerText,
      price: parseInt(price.innerText),
      quantity: 1
    };

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(product);
    }

    alert("Добавлено в корзину");
  };

  function renderCart() {
    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    cart.forEach(item => {
      container.innerHTML += `
        <div>
          ${item.title} — ${item.price} ₽ × ${item.quantity}
        </div>
      `;
    });
  }

  window.openCart = function() {
    listPage.style.display = "none";
    productPage.style.display = "none";
    cartPage.style.display = "block";

    renderCart();
  };

  window.checkout = function() {
    // const tg = window.Telegram?.WebApp;

    // // 👉 ДОБАВИЛ: безопасное получение user
    // const user = tg?.initDataUnsafe?.user;

    // console.log("USER BEFORE SEND:", user);

    const tg = window.Telegram.WebApp;

const order = {
  initData: tg.initData, // ВОТ ЭТО ГЛАВНОЕ
  items: cart,
  total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
};

tg.sendData(JSON.stringify(order));

    console.log("ORDER:", order);

    if (tg) {
      tg.sendData(JSON.stringify(order));
    } else {
      alert("Не Telegram ❌");
    }

    alert("Заказ отправлен");
  };

  window.openProfile = function() {
    alert("Тут будет профиль / заказы");
  };
});



// document.addEventListener("DOMContentLoaded", () => {
//   console.log("JS загружен");

//   const listPage = document.getElementById("listPage");
//   const productPage = document.getElementById("productPage");
//   const price = document.getElementById("price");
//   const title = document.getElementById("title");
//   const desc = document.getElementById("desc");
//   let cart = [];
//   let currentProductId = null;
//   const cartPage = document.getElementById("cartPage");
//   if (!listPage || !productPage || !cartPage || !title || !desc || !price) {
//   console.error("❌ Один из элементов не найден");
//   return;
// }

// window.openProduct = function(id) {
//   currentProductId = id;

//   listPage.style.display = "none";
//   productPage.style.display = "block";

//   if (id === 1) {
//     title.innerText = "Товар 1";
//     price.innerText = "100";
//     desc.innerText = "Описание товара 1";
//   } else {
//     title.innerText = "Товар 2";
//     price.innerText = "200";
//     desc.innerText = "Описание товара 2";
//   }
// };

// window.goBack = function() {
//   productPage.style.display = "none";
//   cartPage.style.display = "none";
//   listPage.style.display = "block";
// };

//   window.buy = function() {
//   const product = {
//     id: currentProductId,
//     title: title.innerText,
//     price: parseInt(price.innerText),
//     quantity: 1
//   };

//   const existing = cart.find(item => item.id === product.id);

//   if (existing) {
//     existing.quantity += 1;
//   } else {
//     cart.push(product);
//   }

//   alert("Добавлено в корзину");
// };
// function renderCart() {
//   const container = document.getElementById("cartItems");
//   container.innerHTML = "";

//   cart.forEach(item => {
//     container.innerHTML += `
//       <div>
//         ${item.title} — ${item.price} ₽ × ${item.quantity}
//       </div>
//     `;
//   });
// }

// window.openCart = function() {
//   listPage.style.display = "none";
//   productPage.style.display = "none";
//   cartPage.style.display = "block";

//   renderCart();
// };
//  window.checkout = function() {
//   if (!window.Telegram || !window.Telegram.WebApp) {
//     alert("Открой через Telegram ❌");
//     return;
//   }

//   const user = window.Telegram.WebApp.initDataUnsafe
//     ? window.Telegram.WebApp.initDataUnsafe.user
//     : null;

//   console.log("USER:", user);

//   const order = {
//     user: user || null,
//     items: cart,
//     total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
//   };

//   window.Telegram.WebApp.sendData(JSON.stringify(order));

//   alert("Заказ отправлен");
// };
// window.openProfile = function() {
//   alert("Тут будет профиль / заказы");
// };
// }
// );
