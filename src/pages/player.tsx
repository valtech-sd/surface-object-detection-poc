/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";

import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";

type PlayerPageProps = {
  user: "player1" | "player2";
};

function PlayerPage({ user }: PlayerPageProps) {
  const gameRef = doc(useFirestore(), "game", "nintendo");
  const { status, data } = useFirestoreDocData(gameRef);

  const isPlayer1 = useMemo(() => user === "player1", [user]);

  useEffect(() => {
    if (data?.status === "idle" && data[user] === "not_connected") {
      const docInfo = isPlayer1
        ? { player1: "connected" }
        : { player2: "connected" };

      setDoc(gameRef, docInfo, { merge: true });
    }
  }, [isPlayer1, data]);

  const onStartGameClick = () => {
    if (data.status === "idle") {
      setDoc(gameRef, { status: "playing" }, { merge: true });
    }
  };

  const paddleText = useMemo(() => {
    if (data?.winner === "none") {
      return "";
    }

    if (data?.winner === user) {
      return "WINNER";
    }

    return "LOOSER";
  }, [data?.winner]);

  if (status === "loading") {
    return null;
  }

  return (
    <div className={isPlayer1 ? "paddle red" : "paddle blue"}>
      {data.status === "idle" && (
        <button className="start-game" onClick={onStartGameClick}>
          START GAME
        </button>
      )}
      {paddleText && <h1 className="paddle-text">{paddleText}</h1>}
    </div>
  );
}

export default PlayerPage;
