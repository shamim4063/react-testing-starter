import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("userList", () => {
  it("should render no user available when list is empty", () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/no user/i)).toBeInTheDocument();
  });

  it("should render user list when user list is not empty", () => {
    const users: Array<User> = [
      {id: 1,  name: "Shamim" },
      { id: 2, name: "Tasmim" },
    ];
    render(<UserList users={users} />);
    users.forEach(user => {
        const link = screen.getByRole('link', {name: user.name});
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href',  `/users/${user.id}`)
    });
  });
});
