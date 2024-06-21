/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

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
    const onSubmit = vi.fn();

    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      {
        wrapper: AllProvider,
      }
    );

    const waitForFormToLoad = async () => {
      await screen.findByRole("form");

      const nameInput = screen.getByPlaceholderText(/name/i);
      const priceInput = screen.getByPlaceholderText(/price/i);
      const categoryInput = screen.getByRole("combobox");
      const submitButton = screen.getByRole("button");

      type FormData = {
        [key in keyof Product]: any;
      };
      const validData: FormData = {
        id: "1",
        name: "A4tech Keyboard",
        categoryId: category.id,
        price: 100,
      };

      const fillForm = async (product: FormData) => {
        const user = userEvent.setup();

        if (product.name) await user.type(nameInput, product.name);
        if (product.price)
          await user.type(priceInput, product.price.toString());

        if (product.categoryId) {
          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
        }
        await user.click(submitButton);
      };

      return {
        nameInput,
        priceInput,
        categoryInput,
        submitButton,
        fillForm,
        validData,
        onSubmit,
      };
    };

    const toHaveErrorInForm = (errorMessage: RegExp | string) => {
      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    };

    return {
      waitForFormToLoad,
      toHaveErrorInForm,
    };
  };

  it("should render form elements", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();
    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
    expect(nameInput).toHaveFocus();
  });

  it("should render initial data", async () => {
    const product: Product = {
      id: 1,
      name: "Keyboard",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const { nameInput, categoryInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "whitespace",
      name: " ",
      errorMessage: /empty/i,
    },
    {
      scenario: "too long",
      name: "a".repeat(256),
      errorMessage: "255",
    },
  ])(
    "should display error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, toHaveErrorInForm } = renderComponent();
      const { fillForm, validData } = await waitForFormToLoad();

      await fillForm({ ...validData, name });
      toHaveErrorInForm(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: "1000",
    },
    {
      scenario: "lower than 1",
      price: -1,
      errorMessage: "1",
    },
    {
      scenario: "not a number",
      price: "price",
      errorMessage: /required/i,
    },
  ])(
    "should display error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, toHaveErrorInForm } = renderComponent();
      const { fillForm, validData } = await waitForFormToLoad();

      await fillForm({ ...validData, price });

      toHaveErrorInForm(errorMessage);
    }
  );

  it("should show error while category is not selected", async () => {
    const { waitForFormToLoad, toHaveErrorInForm } = renderComponent();
    const { fillForm, validData } = await waitForFormToLoad();

    await fillForm({ ...validData, categoryId: undefined });

    toHaveErrorInForm(/required/i);
  });

  it("should submit form with valid data", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { fillForm, validData, onSubmit } = await waitForFormToLoad();

    await fillForm(validData);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { id, ...formData } = validData;
    expect(onSubmit).toBeCalledWith(formData);
  });

  it("should submit form render error if it gets failed", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { fillForm, validData, onSubmit } = await waitForFormToLoad();

    onSubmit.mockRejectedValue({});

    await fillForm(validData);

    const error = await screen.findByRole("status");
    expect(error).toHaveTextContent(/error/i);
  });

  it("should disable the submit button while processing the reqiest", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { fillForm, validData, onSubmit, submitButton } =
      await waitForFormToLoad();

    onSubmit.mockResolvedValue(new Promise(() => {}));

    await fillForm(validData);
    expect(submitButton).toBeDisabled();
  });

  it("should re-enabled the submit button while processing the request", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { fillForm, validData, onSubmit, submitButton } =
      await waitForFormToLoad();

    onSubmit.mockResolvedValue({});

    await fillForm(validData);
    expect(submitButton).not.toBeDisabled();
  });


  it.only('should be reset the form after submission', async ()=>{
    const { waitForFormToLoad } = renderComponent();
    const { nameInput, priceInput, fillForm, validData, onSubmit } =
      await waitForFormToLoad();

    onSubmit.mockResolvedValue({});

    await fillForm({...validData});

    expect(nameInput).not.toHaveValue();
    expect(priceInput).not.toHaveValue();
    //expect(categoryInput).not.toHaveTextContent(category.name);
  })

});
