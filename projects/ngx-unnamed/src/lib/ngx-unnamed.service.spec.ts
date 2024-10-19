import { TestBed } from '@angular/core/testing';

import { NgxUnnamedService } from './ngx-unnamed.service';

describe('NgxUnnamedService', () => {
  let service: NgxUnnamedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxUnnamedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
