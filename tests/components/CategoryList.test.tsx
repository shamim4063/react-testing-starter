import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import AllProvider from "../Allprovider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utility/simulate.util";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => categories.push(db.category.create()));
  });

  afterAll(() => {
    db.category.deleteMany({
      where: { id: { in: categories.map((x) => x.id) } },
    });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProvider });
  };

  it("should render categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    categories.forEach((category) =>
      expect(screen.queryByText(category.name)).toBeInTheDocument()
    );
  });

  it("should show loading", () => {
    simulateDelay("/categories");
    renderComponent();
    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading after category rendered", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should show error when categories fetch failed", async () => {
    simulateError("/categories");
    renderComponent();
    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  });

});
