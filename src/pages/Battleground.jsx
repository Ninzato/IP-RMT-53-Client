import { Button, Card } from "pixel-retroui";
import { useState, useEffect } from "react";
import SpriteAnimation from "../components/SpriteAnimation/SpriteAnimation";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import background from "../assets/homepage-background.jpg";

export default function Battleground() {
  const [battleData, setBattleData] = useState(null);
  const [currentTurnScore, setCurrentTurnScore] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const { battleId } = useParams();
  const navigate = useNavigate();

  const rollDice = () => {
    const rolledValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(rolledValue);

    if (rolledValue === 1) {
      setCurrentTurnScore(0);
      updateBattleData({ turn: "enemy" });
    } else {
      setCurrentTurnScore((prev) => prev + rolledValue);
    }
  };

  const holdScore = () => {
    updateBattleData({
      enemyHealth: battleData.enemyHealth - currentTurnScore,
      turn: "enemy",
    });
    setCurrentTurnScore(0);
  };

  const computerTurn = () => {
    let computerTurnScore = 0;
    const id = setInterval(() => {
      const rolledValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolledValue);

      if (rolledValue === 1) {
        computerTurnScore = 0;
        clearInterval(id);
        setCurrentTurnScore(0);
        updateBattleData({ turn: "player" });
      } else {
        computerTurnScore += rolledValue;
        setCurrentTurnScore(computerTurnScore);

        if (
          computerTurnScore >= 20 ||
          battleData.characterHealth - computerTurnScore <= 0
        ) {
          clearInterval(id);
          updateBattleData({
            characterHealth: battleData.characterHealth - computerTurnScore,
            turn: "player",
          });
          setCurrentTurnScore(0);
        }
      }
    }, 2000); // Roll every 2 seconds

    setIntervalId(id);
  };

  const updateBattleData = (newData) => {
    setBattleData((prev) => ({ ...prev, ...newData }));
  };

  const restartBattle = () => {
    updateBattleData({
      characterHealth: 100,
      enemyHealth: 100,
      turn: "player",
      result: "undecided",
    });
    setCurrentTurnScore(0);
    setDiceValue(null);
    clearInterval(intervalId);
  };

  const checkWinner = () => {
    if (battleData?.characterHealth <= 0) {
      navigate(`/battle/${battleId}/lose`);
    }
    if (battleData?.enemyHealth <= 0) {
      navigate(`/battle/${battleId}/win`);
    }
    return null;
  };

  const winnerMessage = checkWinner();

  useEffect(() => {
    if (battleData?.turn === "enemy") {
      computerTurn();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [battleData?.turn]);

  const fetchBattleData = async () => {
    try {
      const { data } = await instance({
        method: "GET",
        url: `battle/${battleId}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      setBattleData(data);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchBattleData();
  }, []);

  return (
    <div className="flex flex-col text-center gap-12">
      <img
        src={background}
        alt=""
        className="absolute top-0 left-0 w-screen h-screen object-cover z-[-1]"
      />
      <h1 className="text-3xl font-bold text-white">⚔️ Battleground ⚔️</h1>
      {battleData?.turn !== "player" && (
        <h3 className="text-white font-bold text-lg">{`Enemy's Turn...`}</h3>
      )}
      <div className="flex gap-48">
        <Card
          bg={battleData?.turn === "player" && "#ddceb4"}
          textColor="#30210b"
          borderColor="#30210b"
          shadowColor="#30210b"
          className="p-4 text-center flex-2"
        >
          {battleData?.turn === "player" ? (
            <SpriteAnimation pose={"player-attack"} />
          ) : (
            <SpriteAnimation pose={"player-idle"} />
          )}
          <h2>Player Health: </h2>
          <span>{battleData?.characterHealth}</span>
        </Card>
        <Card
          bg={battleData?.turn !== "player" && "#ddceb4"}
          textColor="#30210b"
          borderColor="#30210b"
          shadowColor="#30210b"
          className="p-4 text-center flex-2"
        >
          {battleData?.turn === "player" ? (
            <SpriteAnimation pose={"enemy-idle"} />
          ) : (
            <SpriteAnimation pose={"enemy-attack"} />
          )}
          <h2>Enemy Health: </h2>
          <span>{battleData?.enemyHealth}</span>
        </Card>
      </div>
      <div className="flex flex-col gap-5">
        <Card
          bg="#fff"
          textColor="#30210b"
          borderColor="#30210b"
          shadowColor="#30210b"
          className="p-4 text-center flex-2"
        >
          Current Turn Damage Accumulation: {currentTurnScore}
        </Card>
        {diceValue && (
          <h2 className="text-white font-bold">
            {diceValue !== 1
              ? `Damage: ${diceValue}`
              : "A miscalculated strike! Your opponent escapes unscathed!"}
          </h2>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <div>
          {battleData?.turn === "player" ? (
            <div className="flex justify-center">
              <Button onClick={rollDice} className="flex-1">
                Roll Dice
              </Button>
              <Button onClick={holdScore} className="flex-1">
                Hold
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
        <Button onClick={restartBattle} className="flex-1">
          Restart Battle
        </Button>
      </div>
      {winnerMessage && <h2>{winnerMessage}</h2>}
    </div>
  );
}
