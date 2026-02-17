const baseHtml = require("../helpers/baseHtml");
const getNavBar = require("../helpers/getNavBar");

const showLogin = (req, res) => {
  const { error } = req.query;

  const content = `
    ${getNavBar({ isDashboard: false })}
    <main class="container">
      <h1>Admin login</h1>

      ${error ? `<p style="color: #b00020;">Credenciales inválidas</p>` : ""}


      <form action="/login" method="POST" class="form">
        <label>
          Usuario
          <input name="username" required />
        </label>

        <label>
          Password
          <input name="password" type="password" required />
        </label>

        <button type="submit">Entrar</button>
      </form>
    </main>
  `;

  res.send(baseHtml({ title: "Login", body: content }));
};

const login = (req, res) => {
  const username = (req.body.username || "").trim();
  const password = (req.body.password || "").trim();

  const envUser = (process.env.ADMIN_USER || "").trim();
  const envPass = (process.env.ADMIN_PASS || "").trim();

  const ok = username === envUser && password === envPass;

  if (!ok) {
    return res.redirect("/login?error=1");
  }

  req.session.isAdmin = true;
  res.redirect("/dashboard");
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/products");
  });
};

module.exports = { showLogin, login, logout };
