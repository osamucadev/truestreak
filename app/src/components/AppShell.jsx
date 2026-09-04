import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AppShell.scss";

const icons = {
  home: "M3 11.5 12 4l9 7.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5z M9 21v-6h6v6",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2",
  stats: "M5 20V10 M12 20V4 M19 20v-7",
  awards: "M8 3h8v5a4 4 0 0 1-8 0z M6 5H4v2a4 4 0 0 0 4 4 M18 5h2v2a4 4 0 0 1-4 4 M12 12v5 M8 21h8 M10 17h4",
};

const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={icons[name]} />
  </svg>
);

const AppShell = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const links = [
    ["/", "home", "Hoje"],
    ["/history", "history", "Histórico"],
    ["/stats", "stats", "Progresso"],
    ["/achievements", "awards", "Marcos"],
  ];

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Navegação principal">
        <NavLink to="/" className="app-brand" aria-label="TrueStreak — início">
          <img className="brand-mark" src="/mark.svg" alt="" />
          <span>TrueStreak</span>
        </NavLink>

        <nav className="app-nav">
          {links.map(([to, icon, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shell-user">
          <span className="shell-avatar">
            {user?.photoURL ? <img src={user.photoURL} alt="" /> : user?.displayName?.[0]?.toUpperCase() || "U"}
          </span>
          <span className="shell-user-copy">
            <strong>{user?.displayName?.split(" ")[0] || "Você"}</strong>
            <button type="button" onClick={handleLogout}>Sair da conta</button>
          </span>
        </div>
      </aside>
      <main className="app-main" id="conteudo">{children}</main>
      <nav className="mobile-app-nav" aria-label="Navegação principal">
        {links.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppShell;
