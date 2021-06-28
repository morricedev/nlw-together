import { Link } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import takenImg from "../assets/images/taken.svg";

export function NotFound404() {
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img className="logo" src={logoImg} alt="Letmeask" />
          </Link>
        </div>
      </header>
      <main>
        <div className="message">
          <div className="message-title">
            <h1>Página não encontrada</h1>
            <p>Oops! Essa página foi abduzida.</p>
          </div>
          <img src={takenImg} className="message-img" alt="" />
        </div>
      </main>
    </div>
  );
}
