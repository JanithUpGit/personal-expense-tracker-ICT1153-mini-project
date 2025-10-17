function getData() {
  return JSON.parse(localStorage.getItem("expensesDb")) || {
    categories: [
      { id: 1, name: "Food", icon: "🍔" },
      { id: 2, name: "Transport", icon: "🚌" },
      { id: 3, name: "Shopping", icon: "🛍️" },
      { id: 4, name: "Entertainment", icon: "🎮" },
    ],
    expenses: [
      {
        id: 1,
        amount: 2500,
        category: 1,
        date: "2025-10-02",
        description: "Lunch with friends"
      },
      {
        id: 2,
        amount: 350,
        category: 2,
        date: "2025-10-02",
        description: "Bus fare to university"
      }
    ]
  };
}

function setData(data) {
  localStorage.setItem("expensesDb", JSON.stringify(data));
}

let expensesDb = getData();

// Render categories table
function renderCategories() {
  const tbody = document.getElementById("category-tbody");
  tbody.innerHTML = "";

  if (expensesDb.categories.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No categories found</td></tr>`;
    return;
  }

  expensesDb.categories.forEach((cat, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.icon}</td>
      <td>${cat.name}</td>
      <td>${cat.description}</td>
      <td><button class="delete-btn" data-index="${index}">❌</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.dataset.index;
      expensesDb.categories.splice(i, 1);
      setData(expensesDb);
      renderCategories();
    });
  });
}

// Add new category
document.getElementById("category-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("category-name").value.trim();
  const icon = document.getElementById("category-icon").value.trim();

  if (!name || !icon) {
    alert("Please fill both fields!");
    return;
  }

  const newId = expensesDb.categories.length
    ? expensesDb.categories[expensesDb.categories.length - 1].id + 1
    : 1;

  expensesDb.categories.push({ id: newId, name, icon });
  setData(expensesDb);
  e.target.reset();
  renderCategories();

});



document.addEventListener("DOMContentLoaded", renderCategories);

