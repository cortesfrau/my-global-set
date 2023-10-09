import { Component, Input } from '@angular/core';
import { Print } from 'src/app/models/print.interface';

@Component({
  selector: 'app-card-print',
  templateUrl: './card-print.component.html',
  styleUrls: ['./card-print.component.scss']
})
export class CardPrintComponent {
  @Input() print!: Print;
}
