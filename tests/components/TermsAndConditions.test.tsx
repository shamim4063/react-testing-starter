import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };

  it("should render terms and condition with initial state", () => {
    const { heading, button, checkbox } = renderComponent();

    expect(heading).toHaveTextContent(/Terms & Conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should enable button when checkbox is checked", async () => {
    const { button, checkbox } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(button).toBeEnabled();

    window.alert = vi.fn();
    await user.click(button);
    expect(window.alert).toHaveBeenCalled();
  });
});
