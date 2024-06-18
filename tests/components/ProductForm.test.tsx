import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProvider from "../Allprovider";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProvider,
    });
  };

  const waitForFormToLoad = async () => {
    await screen.findByRole("form");
    return {
      form: {
        name: screen.getByPlaceholderText(/name/i),
        price: screen.getByPlaceholderText(/price/i),
        category: screen.getByRole("combobox"),
        submitButton: screen.getByRole("button"),
      },
    };
  };

  it("should render form elements", async () => {
    renderComponent();
    const { form } = await waitForFormToLoad();

    expect(form.name).toBeInTheDocument();
    expect(form.price).toBeInTheDocument();
    expect(form.category).toBeInTheDocument();
    expect(form.name).toHaveFocus();
  });

  it("should render initial data", async () => {
    const product: Product = {
      id: 1,
      name: "Keyboard",
      price: 10,
      categoryId: category.id,
    };

    renderComponent(product);
    const { form } = await waitForFormToLoad();

    expect(form.name).toHaveValue(product.name);
    expect(form.price).toHaveValue(product.price.toString());
    expect(form.category).toHaveTextContent(category.name);
  });

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "too long",
      value: "a".repeat(256),
      errorMessage: "255",
    },
  ])(
    "should display error if name is $scenario",
    async ({ value, errorMessage }) => {
      renderComponent();
      const { form } = await waitForFormToLoad();
      const user = userEvent.setup();
      if (value) await user.type(form.name, value);
      await user.type(form.price, "10");
      await user.click(form.category);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(form.submitButton);

      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "greater than 1000",
      value: 1001,
      errorMessage: "1000",
    },
    {
      scenario: "lower than 1",
      value: -1,
      errorMessage: '1',
    },
    {
      scenario: "not a number",
      value: 'price',
      errorMessage: /required/i,
    },
  ])(
    "should display error if price is $scenario",
    async ({ value, errorMessage }) => {
      renderComponent();
      const { form } = await waitForFormToLoad();
      const user = userEvent.setup();

      await user.type(form.name, "Jhon");
      if (value) await user.type(form.price, value.toString());

      await user.click(form.category);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(form.submitButton);

      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );
});
