import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCharacter,
  removeCharacter,
} from "../features/character/characterSlice";
import { Button, Card } from "pixel-retroui";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../utils/axios";
import SpriteAnimation from "../components/SpriteAnimation/SpriteAnimation";
import background from "../assets/homepage-background.jpg";

export default function Homepage() {
  const { character, loading } = useSelector((store) => store.character);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCharacter());
  }, []);

  const handleStartBattle = async () => {
    try {
      const { data } = await instance({
        method: "POST",
        url: "/battle",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        data: {
          characterId: character.id,
          characterHealth: character.health,
        },
      });

      navigate(`/battle/${data.id}`);
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

  const handleDeleteCharacter = async () => {
    try {
      await instance({
        method: "DELETE",
        url: `characters/${character?.id}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      dispatch(removeCharacter());
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

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <img
        src={background}
        alt=""
        className="absolute top-0 left-0 w-screen h-screen object-cover z-[-1]"
      />
      {character === null ? (
        <Link to="/create-character">
          <Button>Create Character</Button>
        </Link>
      ) : (
        <Card bg="#ddceb4" className="p-5 flex flex-col items-center">
          <Link to="/detail">
            <SpriteAnimation pose={"player-idle"} />
          </Link>
          {loading === false ? (
            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleStartBattle}>Start Battle</Button>
              <Button bg="red" textColor="#fff" onClick={handleDeleteCharacter}>
                Delete Character
              </Button>
            </div>
          ) : (
            <p>Loading</p>
          )}
        </Card>
      )}
      <Button onClick={logOut} className="fixed bottom-5 right-5">
        <span className="material-symbols-outlined">logout</span>
      </Button>
    </>
  );
}
