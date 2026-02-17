const getNavBar = ({ active = "", isDashboard = false } = {}) => {
  const categories = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"];

  const links = categories
    .map(
      (c) =>
        `<a class="nav-link ${active === c ? "active" : ""}" href="/products?category=${encodeURIComponent(
          c,
        )}">${c}</a>`,
    )
    .join("");

  const dashboardLinks = isDashboard
    ? `<a class="nav-link" href="/dashboard/new">Nuevo producto</a>
       <a class="nav-link" href="/logout">Logout</a>`
    : `<a class="nav-link" href="/login">Admin</a>`;

  return `
  <header class="nav">
    <a class="brand" href="/products">Tienda</a>
    <nav class="nav-links">
      ${links}
      <span class="spacer"></span>
      ${dashboardLinks}
    </nav>
  </header>
  `;
};

module.exports = getNavBar;
