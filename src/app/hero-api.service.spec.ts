import { TestBed } from '@angular/core/testing';

import { HeroApiService } from './hero-api.service';

describe('HeroApiService', () => {
  let service: HeroApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
