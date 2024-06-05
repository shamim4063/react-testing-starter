import { render, screen } from "@testing-library/react";

import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {

  it('should render user name', ()=>{
    const user: User = {id: 1, name: 'shamim'};

    render(< UserAccount user={user}/>);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render Edit button when user type is admin", () => {
    render(<UserAccount user={{ id: 1, name: "Shamim", isAdmin: true }} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not render Edit button when user type is not admin", () => {
    render(<UserAccount user={{ id: 1, name: "Shamim", isAdmin: false }} />);
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });
});
