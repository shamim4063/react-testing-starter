import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearch = () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.queryByPlaceholderText(/search/i),
      user,
      onChange
    };
  };

  it("it should render search box", () => {
    const { input } = renderSearch();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, user, onChange } = renderSearch();
    const searchTerm = "SearchTerm";
    await user.type(input, searchTerm + "{enter}");
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call onChange when input field is empty", async () => {
    const { input, user, onChange } = renderSearch();
    await user.type(input, "{enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

});
