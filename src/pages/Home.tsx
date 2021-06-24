import { useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import { database } from "../services/firebase";

import { Button } from "../components/Button";

import "../styles/auth.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleLogout() {
    await signOut();
    toast.success("Usuário deslogado com sucesso!", {
      id: "logout",
    });
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Sala não foi encontrada!", {
        id: "logout",
      });
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error("Esta sala foi encerrada!", {
        id: "logout",
      });
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas."
        />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          {user ? (
            <>
              <button onClick={handleCreateRoom} className="create-room">
                Crie sua sala
              </button>
              <button onClick={handleLogout} className="logout">
                Sair
              </button>
            </>
          ) : (
            <button onClick={handleCreateRoom} className="create-room">
              <img src={googleIconImg} alt="Logo do Google" />
              Crie sua sala com o Google
            </button>
          )}
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              value={roomCode}
              type="text"
              placeholder="Digite o código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
