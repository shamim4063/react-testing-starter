import { screen } from "@testing-library/react";
import { db } from "./mocks/db";
import { navigateTo } from "./utils";

describe("RouterTest", () => {
  it("should render the home page for /", () => {
    navigateTo("/");
    expect(screen.getByRole("heading")).toHaveTextContent(/home page/i);
  });

  it("should render the products page for /products", () => {
    navigateTo("/products");
    expect(screen.getByRole("heading")).toHaveTextContent(/products/i);
  });
  it("should render product detail page for /products/:id", async ()=>{
    const product = db.product.create();
    navigateTo('/products/'+ product.id);
    
    expect(await screen.findByRole('heading', {name: product.name})).toBeInTheDocument();
  })

  it("should render the not found for invalid route", ()=>{
    navigateTo('/invalid-route');
    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  })

  it('should render admin home page for /admin', ()=>{
    navigateTo('/admin');
    expect(screen.getByRole('heading', {name: /Admin/i})).toBeInTheDocument();
  })
});
