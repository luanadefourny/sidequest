
import { describe, it, expect } from 'vitest';

describe('A truthy statement', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
  it('should be false', () => {
    expect(false).toBe(false);
  });
})
