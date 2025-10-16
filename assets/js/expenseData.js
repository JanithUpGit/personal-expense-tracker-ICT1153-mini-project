// ----- Database Helper Functions -----
function getData() {
  return JSON.parse(localStorage.getItem("expensesDb")) || {
    categories: [
      { name: "Food", icon: "🍔" },
      { name: "Transport", icon: "🚗" },
      { name: "Shopping", icon: "🛍️" },
      { name: "Entertainment", icon: "🎮" },
    ],
    expenses: []
  };
}

function setData(data) {
  localStorage.setItem("expensesDb", JSON.stringify(data));
}

function deleteData(index) {
  const db = getData();
  db.expenses.splice(index, 1);
  setData(db);
}

function updateData(index, updatedExpense) {
  const db = getData();
  db.expenses[index] = updatedExpense;
  setData(db);
}

// ----- App Logic -----
let expensesDb = getData();

function loadCategories() {
  const select = document.getElementById("category");
  if (!select) return;

  select.innerHTML = `<option value="">Select category</option>`;

  expensesDb.categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name.toLowerCase();
    option.textContent = `${cat.icon} ${cat.name}`;
    select.appendChild(option);
  });
}

function validateForm(formData) {
  const amount = parseFloat(formData.get("amount"));
  const category = formData.get("category");
  const date = formData.get("date");

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return false;
  }
  if (!category) {
    alert("Please select a category.");
    return false;
  }
  if (!date) {
    alert("Please select a date.");
    return false;
  }
  return true;
}

function showMessage(message, type = "error") {
  const messageEl = document.querySelector(".form-message");
  const successEl = document.getElementById("success-msg");

  if (type === "error") {
    messageEl.textContent = message;
    messageEl.style.color = "red";
    successEl.textContent = "";
  } else {
    successEl.textContent = message;
    successEl.style.color = "green";
    messageEl.textContent = "";
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  if (!validateForm(formData)) return;

  const expense = {
    amount: parseFloat(formData.get("amount")),
    category: formData.get("category"),
    date: formData.get("date"),
    description: formData.get("description")
  };

  expensesDb.expenses.push(expense);
  setData(expensesDb);

  showMessage("Expense added successfully!", "success");
  form.reset();
}

// ----- Initialize -----
document.addEventListener("DOMContentLoaded", () => {
  expensesDb = getData();
  loadCategories();

  const form = document.getElementById("expense-form");
  if (form) form.addEventListener("submit", handleFormSubmit);
});
