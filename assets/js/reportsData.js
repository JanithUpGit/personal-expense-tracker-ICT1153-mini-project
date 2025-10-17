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

function renderMonthlyGraph(containerId, labels, data) {
  const chart = document.getElementById(containerId);
  chart.innerHTML = "";
  const max = Math.max(...data, 100);
  data.forEach((val, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (val / max) * 200 + "px";
    bar.style.backgroundColor = "var(--light-green)";

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = "Rs." + val;

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = labels[i];

    bar.appendChild(value);
    bar.appendChild(label);
    chart.appendChild(bar);
  });
}


function renderExpenseTrendLineGraph(canvasId, expenses) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // Prepare canvas
  canvas.width = canvas.clientWidth;
  canvas.height = 300;
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  // Sort expenses by date
  expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by date and sum amounts
  const dailyTotals = {};
  expenses.forEach((e) => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  const labels = Object.keys(dailyTotals).sort();
  const data = labels.map((d) => dailyTotals[d]);
  const maxVal = Math.max(...data, 100);
  const stepX = chartWidth / (labels.length - 1);

  // Draw axes
  ctx.beginPath();
  ctx.strokeStyle = "var(--green)";
  ctx.lineWidth = 1;
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding); // Y-axis
  ctx.lineTo(width - padding, height - padding); // X-axis
  ctx.stroke();

  // Y-axis ticks and labels
  ctx.fillStyle = "var(--green)";
  ctx.font = "12px Poppins";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const yVal = (maxVal / yTicks) * i;
    const y = height - padding - (yVal / maxVal) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding - 5, y);
    ctx.lineTo(padding, y);
    ctx.stroke();
    ctx.fillText(yVal.toFixed(0), padding - 10, y);
  }

  // X-axis labels (only day of month)
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  labels.forEach((label, i) => {
    const x = padding + i * stepX;
    const day = new Date(label).getDate(); // only day
    ctx.fillText(day, x, height - padding + 5);
  });

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle ="var(--green)";
  ctx.lineWidth = 2;
  data.forEach((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (val / maxVal) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw points
  data.forEach((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (val / maxVal) * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#FF6B6B";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  });

  
  ctx.fillStyle = "#222";
  ctx.font = "16px Poppins";
  ctx.textAlign = "center";
}

document.addEventListener("DOMContentLoaded", () => {
  const db = getData();

  const total = db.expenses.reduce((sum, e) => sum + e.amount, 0);
  const today = new Date().toISOString().split("T")[0];
  const todayTotal = db.expenses
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.amount, 0);

  const now = new Date();
  const startWeek = new Date(now);
  startWeek.setDate(now.getDate() - now.getDay());
  const weekTotal = db.expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d >= startWeek && d <= now;
    })
    .reduce((s, e) => s + e.amount, 0);

  const monthTotal = db.expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, e) => s + e.amount, 0);

  document.getElementById("totalExpense").textContent = "Rs." + total;
  document.getElementById("todayExpense").textContent = "Rs." + todayTotal;
  document.getElementById("weekExpense").textContent = "Rs." + weekTotal;
  document.getElementById("monthExpense").textContent = "Rs." + monthTotal;

  const days = {};
  db.expenses.forEach((e) => {
    const d = new Date(e.date).getDate();
    days[d] = (days[d] || 0) + e.amount;
  });
  const dayLabels = Object.keys(days).sort((a, b) => a - b);
  const dayData = dayLabels.map((d) => days[d]);
  renderMonthlyGraph("monthChart", dayLabels, dayData);

  renderExpenseTrendLineGraph("totalGraph", db.expenses);
});
