import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Category, Product } from '../../src/entities';
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import AllProvider from '../Allprovider';
import { db, getProductsByCategory } from '../mocks/db';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProducts', () => {
    const categories: Array<Category> = [];
    const products: Array<Product> = [];

    beforeAll(() => {
        [1, 2, 3].forEach((i) => {
            const category = db.category.create();
            categories.push({ ...category, name: category.name + i });
            [1, 2, 3].forEach(() => {
                products.push(db.product.create({
                    categoryId: category.id
                }))
            })
        })
    })

    afterAll(() => {
        db.category.deleteMany({ where: { id: { in: categories.map(x => x.id) } } });
        db.product.deleteMany({ where: { id: { in: products.map(x => x.id) } } });
    });


    it('should render category loading skeleton', () => {
        simulateDelay('/categories');
        const { getCategorySkeleton } = renderComponent();
        expect(getCategorySkeleton()).toBeInTheDocument();
    });

    it('should remove category loading when Categories rendered.', async () => {
        const { getCategorySkeleton } = renderComponent();
        await waitForElementToBeRemoved(getCategorySkeleton);
    });

    it('should render product loading skeleton', () => {
        simulateDelay('/products');
        const { getProductSkeleton } = renderComponent();
        expect(getProductSkeleton()).toBeInTheDocument();
    });

    it('should remove product loading when Product rendered.', async () => {
        const { getProductSkeleton } = renderComponent();
        await waitForElementToBeRemoved(getProductSkeleton);
    });

    it('should not show error when categories failed to be fetched.', async () => {
        simulateError('/categories');
        const { getCategorySkeleton } = renderComponent();

        await waitForElementToBeRemoved(getCategorySkeleton);

        const message = screen.queryByText(/error/i);
        expect(message).not.toBeInTheDocument();
    })

    it('should not show error when products failed to be fetched.', async () => {
        simulateError('/products');
        renderComponent();
        const message = await screen.findByText(/error/i);
        expect(message).toBeInTheDocument();
    })

    it('should render all category into the combobox', async () => {
        const { categoryCombobox } = renderComponent();

        const combobox = await categoryCombobox();
        expect(combobox).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(combobox);

        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
        expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

        categories.forEach(category => {
            expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument();
        });
    });

    it('should render all product', async () => {
        const { getProductSkeleton } = renderComponent();
        await waitForElementToBeRemoved(getProductSkeleton);
        products.forEach(product => {
            expect(screen.queryByText(product.name)).toBeInTheDocument();
        })
    })

    it('should filter products by selected category', async () => {
        const { selectCategory, toHaveProductsInTheDocument } = renderComponent();

        const selectedCategory = categories[0];
        await selectCategory(selectedCategory.name);

        const products = getProductsByCategory(selectedCategory.id);
        toHaveProductsInTheDocument(products);
    })

    it('should render all products when all selected', async () => {
        const { selectCategory, toHaveProductsInTheDocument } = renderComponent();

        await selectCategory(/all/i);

        const products = db.product.getAll();
        toHaveProductsInTheDocument(products);
    })

    const renderComponent = () => {
        render(<BrowseProducts />, { wrapper: AllProvider });

        const categoryCombobox = () => screen.findByRole('combobox');
        const getProductSkeleton = () => screen.getByRole('progressbar', { name: /products/i });
        const getCategorySkeleton = () => screen.getByRole('progressbar', { name: /categories/i });

        const selectCategory = async (categoryName: RegExp | string) => {
            const combobox = await categoryCombobox();
            const user = userEvent.setup();
            await user.click(combobox);
            const option = screen.getByRole('option', { name: categoryName });
            await user.click(option);
        }

        const toHaveProductsInTheDocument = (products: Array<Product>) => {
            const rows = screen.getAllByRole('row');
            const dataRows = rows.slice(1);
            expect(products.length).toEqual(dataRows.length);
            products.forEach(product => expect(screen.queryByText(product.name)).toBeInTheDocument())
        }

        return {
            getProductSkeleton,
            getCategorySkeleton,
            categoryCombobox,
            selectCategory,
            toHaveProductsInTheDocument
        }
    };

})