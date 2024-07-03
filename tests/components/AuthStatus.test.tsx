import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  it("should show loading when loading is true",  () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });
    render(<AuthStatus />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should show login button when user is not authenticated",  () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });
    render(<AuthStatus />);
    expect(screen.getByRole("button")).toHaveTextContent(/log in/i);
    expect(screen.getByRole("button")).not.toHaveTextContent(/log out/i);
  });

  it("should render username when user is authenticated",  () => {
    const name = "Shamim";
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name },
    });
    render(<AuthStatus />);

    expect(screen.getByRole("button")).toHaveTextContent(/log out/i);
    expect(screen.getByRole("button")).not.toHaveTextContent(/log in/i);
    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
