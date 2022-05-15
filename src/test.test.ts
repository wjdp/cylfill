import {describe, it, expect} from 'vitest'

describe('testing the test suite', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });
    it('uses jsdom in this test file', () => {
        const element = document.createElement('div')
        expect(element).not.toBeNull()
      })
})
