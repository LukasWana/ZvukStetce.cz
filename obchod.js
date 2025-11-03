// otvorenie modálu s produktom
const buttons = document.querySelectorAll(".order-btn");
const modal = document.getElementById("order-modal");
const closeModal = document.getElementById("close-modal");
const productInput = document.getElementById("product");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productName = btn.dataset.product;
    productInput.value = productName;
    modal.style.display = "block";
  });
});

closeModal.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// "odoslanie" formulára (len simulácia)
document.getElementById("order-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Ďakujeme za objednávku! Ozveme sa vám e-mailom.");
  modal.style.display = "none";
  e.target.reset();
});
