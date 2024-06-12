import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import delay from "delay";
import { http, HttpResponse } from "msw";

import ProductList from "../../src/components/ProductList";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductList", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
        const product = db.product.create();
        productIds.push(product.id);
    });
  });
  
  afterAll(() => {
    db.product.deleteMany({where: {id: {in: productIds}}})
  });

  it("should render list of products", async () => {
    render(<ProductList />);
    const litsItems = await screen.findAllByRole("listitem");
    expect(litsItems.length).toBeGreaterThan(0);
  });

  it("should show no product found when products is empty", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));

    render(<ProductList />);
    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it('should render error message when there is an error', async ()=>{
    server.use(http.get("/products", ()=> HttpResponse.error()));

    render(<ProductList/>)
    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  })

  it('should show loading indicator when it fectching data', async ()=>{
    server.use(http.get('/products', async()=>{
      await delay(5000);
      return HttpResponse.json([]);
    }))

    render(<ProductList/>);
    
    const textContent = await screen.findByText(/loading/i);
    expect(textContent).toBeInTheDocument();
  });

  it('should remove loading after data fetched.', async ()=>{
    render(<ProductList />);
    await waitForElementToBeRemoved(()=> screen.queryByText(/loading/i));
  })

  it('should remove loading state if data fetching failed', async ()=>{
    server.use(http.get("/products", ()=> HttpResponse.error()));

    render(<ProductList/>)

    await waitForElementToBeRemoved(()=> screen.queryByText(/loading/i))
  })

});
