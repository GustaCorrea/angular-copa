import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTime } from './modal-time';

describe('ModalTime', () => {
  let component: ModalTime;
  let fixture: ComponentFixture<ModalTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTime],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
