import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import AddCar from "../components/AddCar";

test("open add car modal form", () => {
  render(<AddCar addCar={vi.fn()} />);
  fireEvent.click(screen.getByText("New Car"));
  expect(screen.getByRole("dialog")).toHaveTextContent("New car");
});

test("save passes the typed car to addCar and closes the form", () => {
  const addCar = vi.fn();
  render(<AddCar addCar={addCar} />);
  fireEvent.click(screen.getByText("New Car"));

  const values = {
    Brand: "Lexus",
    Model: "RX",
    Color: "Pearl",
    "Registration number": "KDT-777",
    Year: "2022",
    Price: "45000",
  };
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
  fireEvent.click(screen.getByText("Save"));

  expect(addCar).toHaveBeenCalledWith({
    brand: "Lexus",
    model: "RX",
    color: "Pearl",
    registerNumber: "KDT-777",
    year: "2022",
    price: "45000",
  });
});

test("renders a snapshot", () => {
  const { asFragment } = render(<AddCar addCar={vi.fn()} />);
  expect(asFragment()).toMatchSnapshot();
});
