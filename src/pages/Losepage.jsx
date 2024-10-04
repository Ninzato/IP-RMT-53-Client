import { Button } from "pixel-retroui";
import instance from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import background from "../assets/homepage-background.jpg";

export default function Losepage() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      await instance({
        method: "PATCH",
        url: `/battle/${battleId}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        data: {
          result: "lose",
        },
      });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <img
        src={background}
        alt=""
        className="absolute top-0 left-0 w-screen h-screen object-cover z-[-1]"
      />
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold text-white">YOU LOSE!!</h1>
        <Button onClick={handleClick}>Back to home</Button>
      </div>
    </>
  );
}
