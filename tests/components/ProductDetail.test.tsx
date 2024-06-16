import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import ProductDetail from "../../src/components/ProductDetail";
import AllProvider from "../Allprovider";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;
  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("it should render product detail", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />, { wrapper: AllProvider });

    const productName = await screen.findByText(new RegExp(product!.name));
    const productPrice = await screen.findByText(
      new RegExp(product!.price.toString())
    );

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  });

  it("should show error when there is an error", async () => {
    server.use(http.get("products/:id", () => HttpResponse.error()));

    render(<ProductDetail productId={productId} />, { wrapper: AllProvider });

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });
});
