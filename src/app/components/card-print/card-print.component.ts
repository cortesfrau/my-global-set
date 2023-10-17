import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/card.interface';
import { Print } from 'src/app/models/print.interface';

@Component({
  selector: 'app-card-print',
  templateUrl: './card-print.component.html',
  styleUrls: ['./card-print.component.scss']
})

export class CardPrintComponent {

  @Input() card!: Card;
  @Input() print!: Print;

}
