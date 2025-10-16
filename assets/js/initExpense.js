
const expensesDb = {
  categories: [
    { id: 1, name: "Food", icon: "🍔" },
    { id: 2, name: "Transport", icon: "🚌" },
    { id: 3, name: "Shopping", icon: "🛍️" },
    { id: 4, name: "Bills", icon: "💡" },
    { id: 5, name: "Entertainment", icon: "🎮" },
    { id: 6, name: "Other", icon: "📦" }
  ],

  expenses: [
    {
      id: 1,
      amount: 1200,
      category: 1,
      date: "2025-10-01",
      description: "Lunch at KFC"
    },
    {
      id: 2,
      amount: 350,
      category: 2,
      date: "2025-10-02",
      description: "Bus fare to university"
    },
    {
      id: 3,
      amount: 2400,
      category: 3,
      date: "2025-10-03",
      description: "New pair of shoes"
    },
    {
      id: 4,
      amount: 950,
      category: "Bills",
      date: "2025-10-04",
      description: "Electricity bill"
    },
    {
      id: 5,
      amount: 800,
      category: 3,
      date: "2025-10-05",
      description: "Movie night with friends"
    },
    {
      id: 6,
      amount: 200,
      category: 5,
      date: "2025-10-06",
      description: "Snacks and drinks"
    },
    {
      id: 7,
      amount: 150,
      category: 1,
      date: "2025-10-07",
      description: "Three-wheeler to city"
    },
    {
      id: 8,
      amount: 3000,
      category: 5,
      date: "2025-10-08",
      description: "Bought a new backpack"
    },
    {
      id: 9,
      amount: 450,
      category: 2,
      date: "2025-10-09",
      description: "Dinner at university canteen"
    },
    {
      id: 10,
      amount: 1000,
      category: 4,
      date: "2025-10-10",
      description: "Gift for friend’s birthday"
    }
  ]
};

function getData() {
  return JSON.parse(localStorage.getItem("expensesDb")) || [];
}

function setData(expenses) {
  localStorage.setItem("expensesDb", JSON.stringify(expenses));
}

// Delete an expense by id
function deleteData(id) {
  let expenses = getData();
  expenses = expenses.filter(exp => exp.id !== id);
  setData(expenses);
}

// Update an expense by id
function updateData(id, updatedExpense) {
  let expenses = getData();
  expenses = expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp);
  setData(expenses);
}

// Add a new expense with unique id
function addExpense(expense) {
  let expenses = getData();
  // Assign a unique id (timestamp works well)
  expense.id = Date.now();
  expenses.push(expense);
  setData(expenses);
}




document.addEventListener("DOMContentLoaded", () => {
  setData(expensesDb);
  console.log("expensesDb loaded!");
});
