import { Button, Card } from "pixel-retroui";
import instance from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import SpriteAnimation from "../components/SpriteAnimation/SpriteAnimation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCharacter } from "../features/character/characterSlice";
import { fetchRace } from "../features/race/raceSlice";
import { fetchOccupation } from "../features/occupation/occupationSlice";
import background from "../assets/homepage-background.jpg";
import axios from "axios";

export default function Detailpage() {
  const [additionalData, setAdditionalData] = useState(null);
  const { character } = useSelector((store) => store.character);
  const races = useSelector((store) => store.race.race);
  const occupations = useSelector((store) => store.occupation.occupation);
  const race = races.find((el) => el.id === character?.raceId);
  const occupation = occupations.find(
    (el) => el.id === character?.occupationId
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchBattles = async () => {
    try {
      const { data } = await instance({
        method: "GET",
        url: "/battle",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      if (race) {
        const { data } = await axios({
          method: "GET",
          url: `https://www.dnd5eapi.co/api/races/${race.index}`,
        });
        setAdditionalData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(fetchCharacter());
    dispatch(fetchRace());
    dispatch(fetchOccupation());
    fetchBattles();
  }, []);

  useEffect(() => {
    fetchAdditionalData();
  }, [race]);

  const backToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center relative p-10 ">
      <img
        src={background}
        alt=""
        className="absolute top-0 left-0 w-screen h-full object-cover z-[-1]"
      />
      <Button
        bg="#ddceb4"
        onClick={backToHome}
        className="fixed top-5 left-5 px-5"
      >
        <span className="material-symbols-outlined">home</span>
      </Button>
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-4xl font-bold text-white">Detail Page</h1>
        <div className="flex justify-center items-start gap-5">
          <Card
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            shadowColor="#30210b"
            className="p-4 flex flex-col gap-2"
          >
            <SpriteAnimation pose={"player-idle"} />
          </Card>
          <Card
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            shadowColor="#30210b"
            className="p-4 flex flex-col gap-2 w-1/2"
          >
            <h4 className="text-xl font-bold">Character's Data:</h4>
            <p>
              <span className="font-bold ita">NAME: </span>
              <span className="text-[14px]">{character?.name}</span>
            </p>

            <p>
              <span className="font-bold ita">RACE: </span>
              <span className="text-[14px]">{race?.name}</span>
            </p>
            <p>
              <span className="font-bold ita">SPEED: </span>
              <span className="text-[14px]">{additionalData?.speed}</span>
            </p>
            <p>
              <span className="font-bold ita">OCCUPATION: </span>
              <span className="text-[14px]">{occupation?.name}</span>
            </p>
            <p>
              <span className="font-bold ita">BACKSTORY: </span>
              <span className="text-[14px]">{character?.backstory}</span>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
