import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxUnnamedComponent } from './ngx-unnamed.component';

describe('NgxUnnamedComponent', () => {
  let component: NgxUnnamedComponent;
  let fixture: ComponentFixture<NgxUnnamedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxUnnamedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxUnnamedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
