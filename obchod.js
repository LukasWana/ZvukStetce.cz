// otvorenie modálu s produktom
const buttons = document.querySelectorAll(".order-btn");
const modal = document.getElementById("order-modal");
const qrContainer = document.getElementById("qr1");
const closeModal = document.getElementById("close-modal");
const productInput = document.getElementById("product");
const deliveryInfoText = document.getElementById("delivery-info-text"); // Nový odkaz na text o doručení
const paymentInstructionsText = document.getElementById(
  "payment-instructions-text"
); // Nový odkaz na platobné inštrukcie
const customOrderMessage = document.getElementById("custom-order-message"); // Nový odkaz na vlastnú správu
const vsDisplay = document.getElementById("vs-display");

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productName = btn.dataset.product;
    const productVS = btn.dataset.vs;
    const productPrice = btn.dataset.price;

    productInput.value = productName;
    if (vsDisplay) {
      vsDisplay.textContent = ""; // Vyčistíme VS pre istotu
    }

    // Resetovať viditeľnosť všetkých relevantných elementov
    qrContainer.innerHTML = "";
    qrContainer.style.display = "none";
    paymentInstructionsText.style.display = "none";
    deliveryInfoText.style.display = "none";
    customOrderMessage.style.display = "none";

    // Generovať nový QR kód, len ak je cena > 0
    if (productPrice && parseFloat(productPrice) > 0) {
      // Toto je bežný produkt s cenou, zobrazíme QR kód a platobné inštrukcie
      deliveryInfoText.style.display = "block"; // Zobraziť text o doručení
      vsDisplay.textContent = productVS; // Zobrazíme VS
      // MSG (message) skrátené na VS, aby sa predišlo pretečeniu dát v QR kóde
      const paymentString = `SPD*1.0*ACC:CZ6508000000001234567890*AM:${parseFloat(
        productPrice
      ).toFixed(2)}*CC:CZK*MSG:VS ${productVS}*X-VS:${productVS}`;

      new QRCode(qrContainer, {
        // Vytvoríme QR kód
        text: paymentString,
        width: 180,
        height: 180,
        colorDark: "#333333",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M,
      });
      qrContainer.style.display = "flex"; // Zobraziť QR kontajner
      paymentInstructionsText.style.display = "block"; // Zobraziť platobné inštrukcie
    } else {
      // Toto je produkt bez ceny (na objednávku/firemná akcia), zobrazíme vlastnú správu
      customOrderMessage.innerHTML = `Pro tuto objednávku je potřeba dohodnout se individuálně na zadání i ceně. Pro urychlení komunikace prosím uveďte své telefonní číslo do poznámky.`;
      customOrderMessage.style.display = "block"; // Zobraziť vlastnú správu
    }

    modal.style.display = "block"; // Zobraziť modálne okno
  });
});

closeModal.onclick = () => {
  modal.style.display = "none";
};
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};
document.getElementById("order-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      alert("Děkuji za objednávku! Ozvu se vám e-mailem.");
      modal.style.display = "none";
      form.reset();
    } else {
      alert("Něco se pokazilo. Zkuste to prosím znovu později.");
    }
  } catch (error) {
    alert("Chyba připojení. Zkuste to prosím znovu.");
  }
});
