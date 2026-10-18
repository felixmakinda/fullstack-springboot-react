import { render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Carlist from "../components/Carlist";

afterEach(() => {
  vi.restoreAllMocks();
});

const subaru = {
  brand: "Subaru",
  model: "Impreza",
  color: "White",
  registerNumber: "KDH481G",
  year: 2014,
  price: 12000,
  _links: { self: { href: "http://localhost:8080/api/cars/1" } },
};

test("lists cars with registration number and formatted price, sending the token", async () => {
  sessionStorage.setItem("jwt", "Bearer abc.def.ghi");
  const fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json({ _embedded: { cars: [subaru] } }));

  render(<Carlist logOut={vi.fn()} />);

  expect(await screen.findByText("KDH481G")).toBeInTheDocument();
  expect(screen.getByText((12000).toLocaleString())).toBeInTheDocument();
  expect(fetchSpy.mock.calls[0][1].headers.Authorization).toBe(
    "Bearer abc.def.ghi",
  );
});

test("a rejected token logs the user out", async () => {
  sessionStorage.setItem("jwt", "Bearer expired");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, { status: 401 }),
  );
  vi.spyOn(console, "error").mockImplementation(() => {});
  const logOut = vi.fn();

  render(<Carlist logOut={logOut} />);

  await vi.waitFor(() => expect(logOut).toHaveBeenCalled());
});
