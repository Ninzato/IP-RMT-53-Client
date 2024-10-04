import { useEffect, useState } from "react";
import { Button, Card, Input } from "pixel-retroui";
import { toast } from "react-toastify";
import background from "../assets/register-background.jpg";
import instance from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance({
        method: "POST",
        url: "/auth/login",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      console.log(data, "DATA");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("identifier", data.id);

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

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    try {
      const { data } = await instance({
        method: "POST",
        url: "/auth/login/google",
        headers: {
          google_token: response.credential,
        },
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("identifier", data.id);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "1010393709537-u2k11bdgbotnt6q50g9glr15ofl4bcu5.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
    // window.google.accounts.id.prompt();
  }, []);
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
          <h2 className="text-xl font-bold leading-6 mb-2">Welcome Back!</h2>
          <p className="text-xs ">{`Let's log in and continue your adventure!`}</p>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
            Sign In
          </Button>
        </form>
        <div className="flex flex-col text-center mt-2 md:flex-row md:text-center md:justify-center md:gap-2">
          <span className="text-xs">Do not have an account?</span>
          <Link to="/register" className="text-xs font-bold text-amber-950">
            - Sign Up -
          </Link>
        </div>

        <Card
          bg="white"
          textColor="black"
          borderColor="black"
          shadowColor="black"
          className="w-fit mx-auto mt-5"
        >
          <div id="buttonDiv" className="flex-1"></div>
        </Card>
      </Card>
    </>
  );
}
