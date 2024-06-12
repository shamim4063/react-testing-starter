import { render, screen } from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { HttpResponse, http } from 'msw';

describe('ProductList', () => {
    it('should render list of products', async () => {
        render(<ProductList />);
        const litsItems = await screen.findAllByRole('listitem');
        expect(litsItems.length).toBeGreaterThan(0);
    });

    it('should show no product found when products is empty', async () => {
        server.use(http.get('/products', () => HttpResponse.json([])));

        render(<ProductList />);
        const message = await screen.findByText(/no products/i);
        expect(message).toBeInTheDocument();
    })
})