import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-block',
  templateUrl: './notification-block.component.html',
  styleUrls: ['./notification-block.component.scss']
})
export class NotificationBlockComponent {
  collapseIsOpen = false;

  toggleCollapse() {
    this.collapseIsOpen = !this.collapseIsOpen;
  }

}
