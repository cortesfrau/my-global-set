import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/card.interface';

@Component({
  selector: 'app-card-print-list',
  templateUrl: './card-print-list.component.html',
  styleUrls: ['./card-print-list.component.scss']
})

export class CardPrintListComponent {

  @Input() card!: Card;

}
