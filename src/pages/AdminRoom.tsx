import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import deniedImg from "../assets/images/denied.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import "../styles/room.scss";
import { useEffect, useState } from "react";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const history = useHistory();

  //novo
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  //novo
  useEffect(() => {
    (async () => {
      const roomRef = await database.ref(`rooms/${roomId}`).get();

      if (!roomRef.val()) {
        history.push("/");
      }

      if (roomRef.val().authorId === user?.id) {
        setIsAdmin(true);
        setLoading(false);
      }

      if (!user) {
        setLoading(false);
      }
    })();
  }, [roomId, user, history]);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  //Loading
  if (loading) {
    return (
      <div id="page-room">
        <header>
          <div className="content">
            <Link to="/">
              <img className="logo" src={logoImg} alt="Letmeask" />
            </Link>
            <RoomCode code={roomId} />
          </div>
        </header>
        <main className="spinner-body">
          <div className="spinner"></div>
        </main>
      </div>
    );
  }

  //Unauthorized
  if (!isAdmin) {
    return (
      <div id="page-room">
        <header>
          <div className="content">
            <Link to="/">
              <img className="logo" src={logoImg} alt="Letmeask" />
            </Link>
            <RoomCode code={roomId} />
          </div>
        </header>
        <main>
          <div className="message">
            <div className="message-title">
              <h1>Sem permissão</h1>
              <p>Parece que seu nome não está na lista =(</p>
            </div>
            <img src={deniedImg} className="message-img" alt="" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img className="logo" src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta " />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
