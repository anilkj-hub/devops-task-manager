import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!credentials.username || !credentials.password) return;

    localStorage.setItem('dtm-auth', 'true');
    navigate('/dashboard');
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Manage your engineering work in one place.</p>

        <label>
          Username
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="devops.user"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="********"
          />
        </label>

        <button className="btn primary" type="submit">Login</button>
      </form>
    </main>
  );
}

export default LoginPage;