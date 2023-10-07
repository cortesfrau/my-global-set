import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSearchFormComponent } from './card-search-form.component';

describe('CardSearchFormComponent', () => {
  let component: CardSearchFormComponent;
  let fixture: ComponentFixture<CardSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardSearchFormComponent]
    });
    fixture = TestBed.createComponent(CardSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
