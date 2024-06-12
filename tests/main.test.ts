import { it, describe, expect } from "vitest";

describe('testSetup', () => {
    it('should check test tool setup working', async () => {
        const response = await fetch('/categories');
        const data = await response.json();
        expect(data).toHaveLength(3);
    })
})
