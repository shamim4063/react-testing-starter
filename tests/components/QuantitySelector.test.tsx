import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Calculator",
      price: 10,
      categoryId: 2,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const getAddToCartButton = () =>
      screen.queryByRole("button", {
        name: /add to cart/i,
      });

    const getQuantityControls = () => ({
      incrementButton: screen.queryByRole("button", { name: "+" }),
      decrementButton: screen.queryByRole("button", { name: "-" }),
      quantity: screen.queryByRole("status"),
    });

    const user = userEvent.setup();

    const addToCart =async ()=>{
        const button = getAddToCartButton();
        await user.click(button!)
    } 

    const incrementQuantity = async () =>{
        const {incrementButton} = getQuantityControls();
        await user.click(incrementButton!);
    }

    const decrementQuantity = async () =>{
        const {decrementButton} = getQuantityControls();
        await user.click(decrementButton!);
    }

    return {
      getAddToCartButton,
      addToCart,
      getQuantityControls,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should show qunatity after click add to cart", async () => {
    const { getAddToCartButton, getQuantityControls, addToCart } = renderComponent();

    expect(getAddToCartButton()).toBeInTheDocument();

    await addToCart();

    const { incrementButton, decrementButton, quantity } =
      getQuantityControls();

    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
    expect(quantity).toHaveTextContent("1");
  });

  it("should increase quantity when increment button clicked", async () => {
    const { getQuantityControls, addToCart, incrementQuantity } = renderComponent();

    await addToCart()
    await incrementQuantity();

    const {quantity} = getQuantityControls();

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity.", async () => {
    const { getQuantityControls, addToCart, incrementQuantity, decrementQuantity } = renderComponent();

    await addToCart();
    await incrementQuantity();
    await decrementQuantity();

    const {quantity} = getQuantityControls();

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the car  t", async () => {
    const { getAddToCartButton, getQuantityControls, decrementQuantity, addToCart } = renderComponent();

    await addToCart();
    await decrementQuantity();

    const { decrementButton, incrementButton, quantity } =
      getQuantityControls();


    expect(quantity).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
