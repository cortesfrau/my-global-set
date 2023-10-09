// app-card-print-list.component.ts
import { Component, Input } from '@angular/core';
import { Print } from 'src/app/models/print.interface';

@Component({
  selector: 'app-card-print-list',
  templateUrl: './card-print-list.component.html',
  styleUrls: ['./card-print-list.component.scss']
})
export class CardPrintListComponent {
  @Input() prints: Print[] = [];
}
