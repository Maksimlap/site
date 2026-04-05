document.addEventListener("DOMContentLoaded", () => {
  console.log("JS загружен");

  const tg = window.Telegram?.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  // 🔥 получаем userId (URL → fallback Telegram)
  const params = new URLSearchParams(window.location.search);
  let userId = params.get("userId");

  if (!userId) {
    userId = tg?.initDataUnsafe?.user?.id;
  }

  console.log("USER ID:", userId);
  console.log("URL:", window.location.href);

  const listPage = document.getElementById("listPage");
  const productPage = document.getElementById("productPage");
  const cartPage = document.getElementById("cartPage");
  const profilePage = document.getElementById("profilePage");
  const price = document.getElementById("price");
  const title = document.getElementById("title");
  const desc = document.getElementById("desc");

  let cart = [];
  let currentProductId = null;

  if (!listPage || !productPage || !cartPage || !title || !desc || !price) {
    console.error("❌ Один из элементов не найден");
    return;
  }

  // 🔥 открыть товар
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

  // 🔥 назад
  window.goBack = function() {
    productPage.style.display = "none";
    cartPage.style.display = "none";
    listPage.style.display = "block";
    profilePage.style.display = "none";
  };

  // 🔥 добавить в корзину
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

  // 🔥 рендер корзины
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

  // 🔥 открыть корзину
  window.openCart = function() {
    listPage.style.display = "none";
    productPage.style.display = "none";
    cartPage.style.display = "block";
    profilePage.style.display = "none";

    renderCart();
  };

  // 🔥 оформление заказа
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

  // 🔥 формат заказа
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

  // 🔥 ЛК (главное)
  window.openProfile = async function() {
    if (!userId) {
      alert("userId не найден ❌\nОткрой через /start");
      return;
    }

    try {
      const url = `https://tgbot-production-8fee.up.railway.app/orders/${userId}`;
      console.log("FETCH:", url);

      const res = await fetch(url);
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
  
      listPage.style.display = "none";
      productPage.style.display = "none";
      cartPage.style.display = "none";
      profilePage.style.display = "block";

    } catch (e) {
      console.error("FETCH ERROR:", e);
      alert("Ошибка загрузки заказов ❌");
    }
  };
});
