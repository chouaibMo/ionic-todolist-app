import { UserData } from './userData';

describe('User', () => {
  it('should create an instance', () => {
    expect(new UserData('','','')).toBeTruthy();
  });
});
