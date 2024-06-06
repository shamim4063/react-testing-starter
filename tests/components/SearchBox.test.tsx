import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
// import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearch = () => {
    render(<SearchBox onChange={vi.fn()} />);
    return {
      input: screen.queryByPlaceholderText("Search..."),
      onChange: vi.fn(),
    };
  };

  it("it should render search box", () => {
    const { input } = renderSearch();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    // const { input, onChange } = renderSearch();
    // const searchTerm = "Searchterm";
    // const user = userEvent.setup();

    // await user.type(input, searchTerm);
  });
});
