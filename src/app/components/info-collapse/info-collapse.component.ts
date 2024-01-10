import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-collapse',
  templateUrl: './info-collapse.component.html',
  styleUrls: ['./info-collapse.component.scss'],
  standalone: true,
	imports: [NgbCollapseModule],
})
export class InfoCollapseComponent {
	isCollapsed = true;
}
