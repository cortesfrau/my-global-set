import { TestBed } from '@angular/core/testing';

import { ScryvelService } from './scryvel.service';

describe('ScryvelService', () => {
  let service: ScryvelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScryvelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
