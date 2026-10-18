import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Login from "../components/Login";

// Carlist talks to the backend and renders the DataGrid; a stand-in keeps these tests about login
vi.mock("../components/Carlist", () => ({
  default: (props) => (
    <button onClick={props.logOut}>Fake car list: log out</button>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

function logIn(username, password) {
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: username },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
}

test("a failed login shows an error message", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, { status: 401 }),
  );
  render(<Login />);
  logIn("tester", "wrong");

  expect(
    await screen.findByText("Login failed: Check your username and password"),
  ).toBeInTheDocument();
  expect(sessionStorage.getItem("jwt")).toBeNull();
});

test("a successful login stores the token and shows the car list", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, {
      status: 200,
      headers: { Authorization: "Bearer abc.def.ghi" },
    }),
  );
  render(<Login />);
  logIn("tester", "secret");

  expect(await screen.findByText("Fake car list: log out")).toBeInTheDocument();
  expect(sessionStorage.getItem("jwt")).toBe("Bearer abc.def.ghi");

  const [url, options] = fetchSpy.mock.calls[0];
  expect(url).toMatch(/\/login$/);
  expect(options.method).toBe("POST");
  expect(JSON.parse(options.body)).toEqual({
    username: "tester",
    password: "secret",
  });
});

test("logging out clears the token and shows the login form again", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, {
      status: 200,
      headers: { Authorization: "Bearer abc.def.ghi" },
    }),
  );
  render(<Login />);
  logIn("tester", "secret");

  fireEvent.click(await screen.findByText("Fake car list: log out"));

  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  expect(sessionStorage.getItem("jwt")).toBeNull();
});

test("submitting the form with Enter logs in", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, {
      status: 200,
      headers: { Authorization: "Bearer abc.def.ghi" },
    }),
  );
  render(<Login />);
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "tester" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "secret" },
  });

  // Pressing Enter in a field submits its form
  fireEvent.submit(screen.getByLabelText("Password").closest("form"));

  expect(await screen.findByText("Fake car list: log out")).toBeInTheDocument();
  expect(fetchSpy).toHaveBeenCalledTimes(1);
});
