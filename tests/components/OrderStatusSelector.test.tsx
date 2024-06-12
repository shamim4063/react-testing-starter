import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';


describe('OrderStatusSelector', () => {
    const renderComponent = () => {
        const onChange = vi.fn();
        render(<Theme>
            <OrderStatusSelector onChange={onChange} />
        </Theme>);
        return {
            onChange,
            trigger: screen.getByRole('combobox'),
            user: userEvent.setup(),
            getOption: (label: RegExp) => screen.findByRole('option', { name: label }),
            getOptions: () => screen.findAllByRole('option'),
        }
    }
    it('should render component with default selector', () => {
        const { trigger } = renderComponent();
        expect(trigger).toHaveTextContent(/new/i);
    })

    it('should render correct statuses', async () => {
        const { trigger, user, getOptions } = renderComponent();
        await user.click(trigger);

        const options = await getOptions();
        expect(options).toHaveLength(3);

        const labels = options.map(option => option.textContent);
        expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
    })

    it.each([
        { label: /processed/i, value: 'processed' },
        { label: /fulfilled/i, value: 'fulfilled' }
    ])('should call on change with $value when $label option is selected', async ({ label, value }) => {
        const { trigger, user, onChange, getOption } = renderComponent();
        await user.click(trigger);
        const option = await getOption(label);

        await user.click(option);
        expect(onChange).toHaveBeenCalledWith(value);
    })

    it("should call on change with 'new' when /new/i option is selected", async () => {
        const { trigger, user, onChange, getOption } = renderComponent();
        await user.click(trigger);

        const processedOption = await getOption(/processed/i);
        await user.click(processedOption);

        await user.click(trigger);
        const newOption = await getOption(/new/i);
        await user.click(newOption);

        expect(onChange).toHaveBeenCalledWith('new');
    })
})