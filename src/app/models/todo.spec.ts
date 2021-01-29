import { Todo } from './todo';

describe('Todo', () => {
  it('should create an instance', () => {
    expect(new Todo("test", "test")).toBeTruthy();
  });
});
