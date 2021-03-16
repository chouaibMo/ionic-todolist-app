import { TestBed } from '@angular/core/testing';

import { PrivacyScreenService } from './privacy-screen.service';

describe('PrivacyScreenService', () => {
  let service: PrivacyScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivacyScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
