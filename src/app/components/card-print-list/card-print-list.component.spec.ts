import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPrintListComponent } from './card-print-list.component';

describe('CardPrintListComponent', () => {
  let component: CardPrintListComponent;
  let fixture: ComponentFixture<CardPrintListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardPrintListComponent]
    });
    fixture = TestBed.createComponent(CardPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
