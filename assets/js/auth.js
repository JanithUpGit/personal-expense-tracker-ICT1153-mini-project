document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  function getDB() {
    return JSON.parse(localStorage.getItem("expensesDb")) || { users: [] };
  }

  function setDB(db) {
    localStorage.setItem("expensesDb", JSON.stringify(db));
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();

      if (!name || !email || !password) {
        alert("Please fill all fields!");
        return;
      }

      const db = getDB();

      // Ensure db.users exists
      if (!db.users) db.users = [];

      if (db.users.find((u) => u.email === email)) {
        alert("User already exists!");
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
      };

      db.users.push(newUser);
      setDB(db);

      alert("Account created successfully!");
      window.location.href = "login.html";
    });
  }

  // ✅ Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      const db = getDB();
      const users = db.users || [];

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        alert(`Welcome back, ${user.name}!`);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid email or password!");
      }
    });
  }
});
