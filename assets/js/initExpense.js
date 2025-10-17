const expensesDb = {
  categories: [
    {
      id: 1,
      name: "Food",
      icon: "🍔",
      description: "Meals, snacks, drinks, and groceries",
    },
    {
      id: 2,
      name: "Transport",
      icon: "🚌",
      description: "Bus fares, fuel, taxi, and travel costs",
    },
    {
      id: 3,
      name: "Shopping",
      icon: "🛍️",
      description: "Clothing, accessories, and household items",
    },
    {
      id: 4,
      name: "Bills",
      icon: "💡",
      description: "Electricity, water, phone, and internet bills",
    },
    {
      id: 5,
      name: "Entertainment",
      icon: "🎮",
      description: "Movies, games, parties, and events",
    },
    {
      id: 6,
      name: "Other",
      icon: "📦",
      description: "Miscellaneous expenses not in other categories",
    },
  ],

  expenses: [
    {
      id: 1,
      amount: 1200,
      category: 1,
      date: "2025-10-01",
      description: "Lunch at KFC",
    },
    {
      id: 2,
      amount: 350,
      category: 2,
      date: "2025-10-02",
      description: "Bus fare to university",
    },
    {
      id: 3,
      amount: 2400,
      category: 3,
      date: "2025-10-03",
      description: "New pair of shoes",
    },
    {
      id: 4,
      amount: 950,
      category: 2,
      date: "2025-10-04",
      description: "Electricity bill",
    },
    {
      id: 5,
      amount: 800,
      category: 3,
      date: "2025-10-05",
      description: "Movie night with friends",
    },
    {
      id: 6,
      amount: 200,
      category: 5,
      date: "2025-10-06",
      description: "Snacks and drinks",
    },
    {
      id: 7,
      amount: 150,
      category: 1,
      date: "2025-10-07",
      description: "Three-wheeler to city",
    },
    {
      id: 8,
      amount: 3000,
      category: 5,
      date: "2025-10-08",
      description: "Bought a new backpack",
    },
    {
      id: 9,
      amount: 450,
      category: 2,
      date: "2025-10-09",
      description: "Dinner at university canteen",
    },
    {
      id: 10,
      amount: 1000,
      category: 4,
      date: "2025-10-10",
      description: "Gift for friend’s birthday",
    },
    {
      id: 11,
      amount: 600,
      category: 1,
      date: "2025-10-11",
      description: "Breakfast and coffee at cafe",
    },
    {
      id: 12,
      amount: 200,
      category: 2,
      date: "2025-10-12",
      description: "Bus fare to shopping mall",
    },
    {
      id: 13,
      amount: 3200,
      category: 3,
      date: "2025-10-13",
      description: "New jeans and t-shirt",
    },
    {
      id: 14,
      amount: 1200,
      category: 4,
      date: "2025-10-14",
      description: "Wi-Fi monthly bill",
    },
    {
      id: 15,
      amount: 500,
      category: 5,
      date: "2025-10-15",
      description: "Gaming session at arcade",
    },
    {
      id: 16,
      amount: 100,
      category: 6,
      date: "2025-10-16",
      description: "Printing notes for class",
    },
    {
      id: 17,
      amount: 250,
      category: 1,
      date: "2025-10-17",
      description: "Evening snack and tea",
    },
    {
      id: 18,
      amount: 800,
      category: 2,
      date: "2025-10-18",
      description: "Taxi to attend seminar",
    },
    {
      id: 19,
      amount: 2700,
      category: 3,
      date: "2025-10-19",
      description: "Bought smartwatch online",
    },
    {
      id: 20,
      amount: 950,
      category: 4,
      date: "2025-10-20",
      description: "Mobile phone bill",
    },
    {
      id: 21,
      amount: 700,
      category: 1,
      date: "2025-10-21",
      description: "Dinner with friends",
    },
    {
      id: 22,
      amount: 300,
      category: 2,
      date: "2025-10-22",
      description: "Train fare to hometown",
    },
    {
      id: 23,
      amount: 1800,
      category: 3,
      date: "2025-10-23",
      description: "New pair of headphones",
    },
    {
      id: 24,
      amount: 400,
      category: 1,
      date: "2025-10-24",
      description: "Snacks at university canteen",
    },
    {
      id: 25,
      amount: 1200,
      category: 5,
      date: "2025-10-25",
      description: "Netflix monthly subscription",
    },
    {
      id: 26,
      amount: 450,
      category: 6,
      date: "2025-10-26",
      description: "Stationery and books",
    },
    {
      id: 27,
      amount: 100,
      category: 2,
      date: "2025-10-27",
      description: "Bus fare to lab class",
    },
    {
      id: 28,
      amount: 950,
      category: 1,
      date: "2025-10-28",
      description: "Lunch and juice at cafe",
    },
    {
      id: 29,
      amount: 2000,
      category: 3,
      date: "2025-10-29",
      description: "Bought new shoes for trip",
    },
    {
      id: 30,
      amount: 300,
      category: 5,
      date: "2025-10-30",
      description: "Snacks for movie night",
    },
  ],
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
  expenses = expenses.filter((exp) => exp.id !== id);
  setData(expenses);
}

// Update an expense by id
function updateData(id, updatedExpense) {
  let expenses = getData();
  expenses = expenses.map((exp) =>
    exp.id === id ? { ...exp, ...updatedExpense } : exp
  );
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
