import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'poss-web-ui-bill-cancel-request-status',
  templateUrl: './ui-bill-cancel-request-status.component.html'
})
export class UiBillCancelRequestStatusComponent  {
  @Input() data;
  @Input() statusColor;
  constructor(private router: Router) {}


}
