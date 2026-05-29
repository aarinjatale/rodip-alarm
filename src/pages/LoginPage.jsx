import { useState } from "react";
import { Icon } from "../components/Icon";

export function LoginPage({ setIsLoggedIn, navigate }) {
  const [email, setEmail] = useState("admin@rodip.com");
  const [password, setPassword] = useState("admin123");

  const submit = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <main className="content login-content">
      <form className="login-card" onSubmit={submit}>
        <div className="login-heading">
          <h1>Sign In</h1>
          <p>Access the carriage monitoring system.</p>
        </div>
        <label className="field">
          <span>Email</span>
          <div className="input-shell">
            <Icon name="mail" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </div>
        </label>
        <label className="field">
          <span>Password</span>
          <div className="input-shell">
            <Icon name="lock" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </div>
        </label>
        <button className="primary-button" type="submit">
          Sign In
        </button>
        <div className="credential-note">Default credentials: admin@rodip.com / admin123</div>
      </form>
    </main>
  );
}
