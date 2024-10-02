import { useState } from "react";
import { Button, Card, Input } from "pixel-retroui";
import { toast } from "react-toastify";
import background from "../assets/register-background.jpg";
import instance from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance({
        method: "POST",
        url: "/auth/register",
        data: {
          username: input.username,
          email: input.email,
          password: input.password,
        },
      });

      setInput({
        username: "",
        email: "",
        password: "",
      });

      toast.success("Your account has been created!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/login");
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
    <div className="flex justify-center items-center relative h-screen px-10 ">
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
            Create An Account
          </h2>
          <p className="text-xs ">Join us now and start your adventure!</p>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Input
            type="text"
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            placeholder="Username..."
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            className="text-xs"
          />
          <Input
            type="email"
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            placeholder="Email..."
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            className="text-xs"
          />
          <Input
            type="password"
            bg="#ddceb4"
            textColor="#30210b"
            borderColor="#30210b"
            placeholder="Password..."
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            className="text-xs"
          />
          <Button
            type="submit"
            bg="#431407"
            borderColor="#30210b"
            shadowColor="#30210b"
            className="text-white mx-1 mt-6"
          >
            Register
          </Button>
        </form>
        <div className="flex flex-col text-center mt-2 md:flex-row md:text-center md:justify-center md:gap-2">
          <span className="text-xs">Have an account?</span>
          <Link to="/login" className="text-xs font-bold text-amber-950">
            - Sign In -
          </Link>
        </div>
      </Card>
    </div>
  );
}
