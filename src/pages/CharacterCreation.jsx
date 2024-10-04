import { Button, Card, Input } from "pixel-retroui";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRace } from "../features/race/raceSlice";
import { fetchOccupation } from "../features/occupation/occupationSlice";
import { toast } from "react-toastify";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import background from "../assets/homepage-background.jpg";

export default function CharacterCreation() {
  const [input, setInput] = useState({
    name: "",
    raceId: "",
    occupationId: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const races = useSelector((store) => store.race.race);
  const occupations = useSelector((store) => store.occupation.occupation);
  useEffect(() => {
    dispatch(fetchRace());
    dispatch(fetchOccupation());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance({
        method: "POST",
        url: "/characters",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        data: {
          name: input.name,
          raceId: input.raceId,
          occupationId: input.occupationId,
        },
      });

      navigate("/");
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
  return (
    <>
      <img
        src={background}
        alt=""
        className="absolute top-0 left-0 w-screen h-screen object-cover z-[-1]"
      />
      <Card
        bg="#ddceb4"
        textColor="#30210b"
        borderColor="#30210b"
        shadowColor="#30210b"
        className="p-4 flex flex-col rounded-md"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold leading-6 mb-2">
            Character Creation
          </h2>
          <p className="text-xs ">{`Let's create your chaaracter and start your adventure!`}</p>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Input
            type="name"
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            placeholder="Character name..."
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="text-xs"
          />
          <Card
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            shadowColor="#30210b"
            className="p-4 flex flex-col gap-2"
          >
            <p className="font-bold">Pick Your Character Race!</p>
            <div className="grid grid-cols-3">
              {races.length > 1 &&
                races.map((el, i) => (
                  <label key={i}>
                    | {el.name}
                    <input
                      type="radio"
                      name="raceId"
                      value={el.id}
                      className="mx-2"
                      onChange={(e) =>
                        setInput({ ...input, raceId: e.target.value })
                      }
                    />
                  </label>
                ))}
            </div>
          </Card>
          <Card
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            shadowColor="#30210b"
            className="p-4 flex flex-col gap-2"
          >
            <p className="font-bold">Pick Your Character Occupation!</p>
            <div className="grid grid-cols-3">
              {occupations.length > 1 &&
                occupations.map((el, i) => (
                  <label key={i}>
                    | {el.name}
                    <input
                      type="radio"
                      name="occupationId"
                      value={el.id}
                      className="mx-2"
                      onChange={(e) =>
                        setInput({ ...input, occupationId: e.target.value })
                      }
                    />
                  </label>
                ))}
            </div>
          </Card>

          <Button
            type="submit"
            bg="#431407"
            borderColor="#30210b"
            shadowColor="#30210b"
            className="text-white mx-1 mt-6"
          >
            Create Character
          </Button>
        </form>
      </Card>
    </>
  );
}
