// ----- Database Helper Functions -----
function getData() {
  return JSON.parse(localStorage.getItem("expensesDb")) || {
    categories: [
      { id: 1, name: "Food", icon: "🍔" },
      { id: 2, name: "Transport", icon: "🚗" },
      { id: 3, name: "Shopping", icon: "🛍️" },
      { id: 4, name: "Entertainment", icon: "🎮" },
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

// ----- Search -----
function searchExpenses(keyword) {
  const db = getData();
  const lower = keyword.toLowerCase();
  return db.expenses.filter(exp => 
    exp.description.toLowerCase().includes(lower) ||
    db.categories.find(c => c.id === exp.category)?.name.toLowerCase().includes(lower)
  );
}

// ----- Render Table -----
function renderExpensesTable(expenses) {
  const tbody = document.querySelector("#expenseBody");
  tbody.innerHTML = "";

  const db = getData();

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No data found</td></tr>`;
    return;
  }

  expenses.forEach((exp, i) => {
    const category = db.categories.find(c => c.id === exp.category);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>Rs.${exp.amount}</td>
      <td>${category ? category.icon + " " + category.name : "Unknown"}</td>
      <td>${exp.date}</td>
      <td>${exp.description}</td>
    `;
    tbody.appendChild(row);
  });
}

// ----- Calculations -----
function calculateTotalExpenses() {
  const db = getData();
  return db.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
}

function calculateTodayExpenses() {
  const db = getData();
  const today = new Date().toISOString().split("T")[0];
  return db.expenses
    .filter(exp => exp.date === today)
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
}

function calculateWeekExpenses() {
  const db = getData();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return db.expenses
    .filter(exp => {
      const date = new Date(exp.date);
      return date >= startOfWeek && date <= endOfWeek;
    })
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
}

function calculateMonthExpenses() {
  const db = getData();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return db.expenses
    .filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
}

// ----- Graph Data -----
function getTotalExpenseByCategory() {
  const db = getData();
  const totals = {};

  db.expenses.forEach(exp => {
    const cat = db.categories.find(c => c.id === exp.category);
    const catName = cat ? cat.name : "Unknown";
    totals[catName] = (totals[catName] || 0) + Number(exp.amount);
  });

  return {
    labels: Object.keys(totals),
    data: Object.values(totals)
  };
}

function getMonthlyExpenseData() {
  const db = getData();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const dailyTotals = {};

  db.expenses.forEach(exp => {
    const date = new Date(exp.date);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      const day = exp.date;
      dailyTotals[day] = (dailyTotals[day] || 0) + Number(exp.amount);
    }
  });

  return {
    labels: Object.keys(dailyTotals),
    data: Object.values(dailyTotals)
  };
}

// ----- On Load -----
document.addEventListener("DOMContentLoaded", () => {
  const db = getData();
  renderExpensesTable(db.expenses);

  document.querySelector("#totalExpense").textContent = "Rs." + calculateTotalExpenses();
  document.querySelector("#todayExpense").textContent = "Rs." + calculateTodayExpenses();
  document.querySelector("#weekExpense").textContent = "Rs." + calculateWeekExpenses();
  document.querySelector("#monthExpense").textContent = "Rs." + calculateMonthExpenses();

  // 🔍 Search handler
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", e => {
    const results = searchExpenses(e.target.value);
    renderExpensesTable(results);
  });
});
