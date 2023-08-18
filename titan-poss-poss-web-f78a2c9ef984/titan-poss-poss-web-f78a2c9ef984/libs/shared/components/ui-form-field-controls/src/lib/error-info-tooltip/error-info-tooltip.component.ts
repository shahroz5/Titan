import { Component, Input } from '@angular/core';

@Component({
  selector: 'poss-web-error-info-tooltip',
  templateUrl: './error-info-tooltip.component.html'
})
export class ErrorInfoTooltipComponent {
  @Input() errorMessage: any;
  @Input() isOnlyTooltip: boolean;

}
