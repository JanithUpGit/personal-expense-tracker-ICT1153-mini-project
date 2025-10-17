// ----- Database Helper Functions -----
function getData() {
  return (
    JSON.parse(localStorage.getItem("expensesDb")) || {
      categories: [
        { id: 1, name: "Food", icon: "🍔" },
        { id: 2, name: "Transport", icon: "🚗" },
        { id: 3, name: "Shopping", icon: "🛍️" },
        { id: 4, name: "Entertainment", icon: "🎮" },
      ],
      expenses: [],
    }
  );
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
  return db.expenses.filter(
    (exp) =>
      exp.description.toLowerCase().includes(lower) ||
      db.categories
        .find((c) => c.id === exp.category)
        ?.name.toLowerCase()
        .includes(lower)
        
      
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
    const category = db.categories.find((c) => c.id === exp.category);
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

function calculateTotalExpenses() {
  const db = getData();
  return db.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
}

function calculateTodayExpenses() {
  const db = getData();
  const today = new Date().toISOString().split("T")[0];
  return db.expenses
    .filter((exp) => exp.date === today)
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
    .filter((exp) => {
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
    .filter((exp) => {
      const date = new Date(exp.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
}

// ----- Graph Data -----
function getTotalExpenseByCategory() {
  const db = getData();
  const totals = {};

  db.expenses.forEach((exp) => {
    const cat = db.categories.find((c) => c.id === exp.category);
    const catName = cat ? cat.name : "Unknown";
    totals[catName] = (totals[catName] || 0) + Number(exp.amount);
  });

  return {
    labels: Object.keys(totals),
    data: Object.values(totals),
  };
}
function getMonthlyExpenseData() {
  const db = getData();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const dailyTotals = {};

  db.expenses.forEach((exp) => {
    const date = new Date(exp.date);
    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      const day = date.getDate();
      dailyTotals[day] = (dailyTotals[day] || 0) + Number(exp.amount);
    }
  });

  const sortedDays = Object.keys(dailyTotals).sort((a, b) => a - b);

  return {
    labels: sortedDays,
    data: sortedDays.map((day) => dailyTotals[day]),
  };
}

// ----- Chart Rendering Functions -----

function renderBarChart(containerId, labels, data, colors) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (labels.length === 0) {
    container.innerHTML =
      "<p style='text-align:center; width:100%;'>No data</p>";
    return;
  }

  const maxValue = Math.max(...data);
  data.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / maxValue) * 100}%`;

    if (Array.isArray(colors) && colors.length >= 2) {
      bar.style.background = index % 2 === 0 ? colors[0] : colors[1];
    } else {
      bar.style.background = colors;
    }

    const valueLabel = document.createElement("div");
    valueLabel.className = "bar-value";
    valueLabel.textContent = "Rs." + value;

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = labels[index];

    bar.appendChild(valueLabel);
    bar.appendChild(label);
    container.appendChild(bar);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const db = getData();
  renderExpensesTable(db.expenses);

  document.querySelector("#totalExpense").textContent =
    "Rs." + calculateTotalExpenses();
  document.querySelector("#todayExpense").textContent =
    "Rs." + calculateTodayExpenses();
  document.querySelector("#weekExpense").textContent =
    "Rs." + calculateWeekExpenses();
  document.querySelector("#monthExpense").textContent =
    "Rs." + calculateMonthExpenses();

  const monthData = getMonthlyExpenseData();
  renderBarChart("monthChart", monthData.labels, monthData.data, [
    "linear-gradient(to top, var(--green), var(--light-green))",
    "linear-gradient(to top, var(--yellow), var(--orange))",
  ]);

  const catData = getTotalExpenseByCategory();
  renderBarChart(
    "categoryChart",
    catData.labels,
    catData.data,
    "linear-gradient(to top, var(--yellow), var(--light-green))"
  );

  // 🔍 Search handler
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const results = searchExpenses(e.target.value);
    renderExpensesTable(results);
  });
});
