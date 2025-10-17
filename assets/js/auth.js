document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  function getData() {
    return JSON.parse(localStorage.getItem("expensesDb")) || { users: [] };
  }

  function setData(db) {
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
      if (password.length < 4) {
        alert("Password must be at least 4 characters long!");
        return;
      }

      const db = getData();

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
      setData(db);

      alert("Account created successfully!");
      window.location.href = "login.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        alert("Please fill all fields!");
        return;
      }

      const db = getData();
      const users = db.users || [];

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        alert(`Welcome back, ${user.name}!`);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "index.html";
      } else {
        alert("Invalid email or password!");
      }
    });
  }
});
