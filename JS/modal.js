document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  fetch("/HTML/modal_customer.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      setupModal();
    });

  function setupModal() {
    const modal = document.getElementById("customerModal");
    const openBtn = document.getElementById("openModal");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelModal");

    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }
  
});
document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    fetch("/HTML/modal_accountManager.html")
        .then(res => res.text())
        .then(html => {
        container.innerHTML = html;
        setupAccModal();
    });

    function setupAccModal() {
        const modalMan = document.getElementById("managerModal");
        const openAccBtn = document.getElementById("openAccModal");
        const closeAccBtn = document.getElementById("closeAccModal");
        const cancelAccBtn = document.getElementById("cancelAccModal");

        openAccBtn.addEventListener("click", () => modalMan.classList.remove("hidden"));
        closeAccBtn.addEventListener("click", () => modalMan.classList.add("hidden"));
        cancelAccBtn.addEventListener("click", () => modalMan.classList.add("hidden"));

        window.addEventListener("click", (e) => {
            if (e.target === modalMan) modalMan.classList.add("hidden");
        });
    }
});
//   fetch('/HTML/modal_customer.html')
//     .then(response => response.text())
//     .then(html => document.body.insertAdjacentHTML('beforeend', html))
//     .then(() => {
//       const openBtn = document.getElementById("openCustomerModal");

//       openBtn.addEventListener("click", () => {
//         const modal = document.getElementById("customer-modal");
//         const input = document.getElementById("customerNameInput");
//         const submit = document.getElementById("submitCustomerModal");

//         modal.classList.remove("hidden");
//         input.value = "";
//         submit.disabled = true;

//         // Enable submit if name is entered
//         input.addEventListener("input", () => {
//           submit.disabled = input.value.trim() === "";
//         });

//         // Cancel buttons
//         document.getElementById("cancelCustomerModal").onclick =
//         document.getElementById("cancelCustomerModal2").onclick = () => {
//           modal.classList.add("hidden");
//         };

//         // Optional: Handle form submit
//         document.querySelector("#customer-modal form").onsubmit = (e) => {
//           e.preventDefault();
//           if (input.value.trim()) {
//             modal.classList.add("hidden");
//             // Insert customer logic here
//             console.log("Customer added:", input.value);
//           }
//         };
//       });
//     });
