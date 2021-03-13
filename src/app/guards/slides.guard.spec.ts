import { TestBed } from '@angular/core/testing';

import { SlidesGuard } from './slides.guard';

describe('SlidesGuard', () => {
  let guard: SlidesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SlidesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
