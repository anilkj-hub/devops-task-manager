import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dtm-auth');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <h1>DevOps Task Manager</h1>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <button className="btn ghost" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Navbar;