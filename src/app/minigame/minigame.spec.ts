import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minigame } from './minigame';

describe('Minigame', () => {
  let component: Minigame;
  let fixture: ComponentFixture<Minigame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minigame],
    }).compileComponents();

    fixture = TestBed.createComponent(Minigame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
