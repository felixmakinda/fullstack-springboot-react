import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

test("renders the app bar and the login form", () => {
  render(<App />);
  expect(screen.getByText("Car Inventory")).toBeInTheDocument();
  expect(screen.getByLabelText("Username")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
});
