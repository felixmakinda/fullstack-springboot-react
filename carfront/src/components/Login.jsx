import { useState } from "react";
import { SERVER_URL } from "../constants";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Carlist from "./Carlist";

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isAuthenticated, setAuth] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const login = (event) => {
    // Stop the browser from reloading the page when the form is submitted
    event.preventDefault();
    fetch(SERVER_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        const jwtToken = res.headers.get("Authorization");
        if (jwtToken !== null) {
          sessionStorage.setItem("jwt", jwtToken);
          setAuth(true);
        } else {
          setOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const logout = () => {
    sessionStorage.removeItem("jwt");
    setAuth(false);
  };

  if (isAuthenticated) {
    return <Carlist logOut={logout} />;
  }

  return (
    <div>
      <form onSubmit={login}>
        <Stack spacing={2} alignItems="center" mt={2}>
          <TextField name="username" label="Username" onChange={handleChange} />
          <TextField
            type="password"
            name="password"
            label="Password"
            onChange={handleChange}
          />
          <Button type="submit" variant="outlined" color="primary">
            Login
          </Button>
        </Stack>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Login failed: Check your username and password"
      />
    </div>
  );
}

export default Login;
