import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chaveamento } from './chaveamento';

describe('Chaveamento', () => {
  let component: Chaveamento;
  let fixture: ComponentFixture<Chaveamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chaveamento],
    }).compileComponents();

    fixture = TestBed.createComponent(Chaveamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
