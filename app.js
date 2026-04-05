document.addEventListener("DOMContentLoaded", () => {
  console.log("JS загружен");
  const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");

console.log("USER ID:", userId);

  const tg = window.Telegram?.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
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

  // 🔥 ОФОРМЛЕНИЕ ЗАКАЗА (без initData)
  window.checkout = function() {
    if (!tg) {
      alert("Открой через Telegram ❌");
      return;
    }

    if (cart.length === 0) {
      alert("Корзина пустая ❌");
      return;
    }

    const order = {
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    };

    console.log("SEND:", order);

    tg.sendData(JSON.stringify(order));

    tg.close();
  };

  function formatOrder(raw) {
  try {
    const order = JSON.parse(raw);

    let text = "";

    order.items.forEach(item => {
      text += `${item.title} × ${item.quantity}\n`;
    });

    text += `💰 ${order.total} ₽`;

    return text;
  } catch {
    return raw;
  }
}

window.openProfile = async function() {
  if (!userId) {
    alert("Ошибка: userId не передан ❌");
    return;
  }

  try {
    const res = await fetch(`https://tgbot-production-8fee.up.railway.app/orders/${userId}`);
    const orders = await res.json();

    const container = document.getElementById("ordersList");
    container.innerHTML = "";

    if (orders.length === 0) {
      container.innerHTML = "<p>У вас пока нет заказов</p>";
    } else {
      orders.forEach(raw => {
        const div = document.createElement("div");
        div.className = "order-card";
        div.innerText = formatOrder(raw);
        container.appendChild(div);
      });
    }

    // переключение страниц
    listPage.style.display = "none";
    productPage.style.display = "none";
    cartPage.style.display = "block";

  } catch (e) {
    console.log(e);
    alert("Ошибка загрузки заказов ❌");
  }

};
});
