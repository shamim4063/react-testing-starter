import { render, screen } from '@testing-library/react'
import Greet from "../../src/components/Greet";

describe("Greet", () => {

  it("should render Greet with provided name in the content", () => {
    render(<Greet name="Shamim" />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/shamim/i)
  });

  it("should render Login button when name is not provided", () => {
    render(<Greet />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i)
  });

});
