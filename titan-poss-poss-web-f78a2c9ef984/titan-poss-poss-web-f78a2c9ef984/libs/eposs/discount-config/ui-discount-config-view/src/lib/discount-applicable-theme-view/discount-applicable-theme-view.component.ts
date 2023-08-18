import { Component, Input } from '@angular/core';
import { NewDiscountApplicableTheme } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discount-applicable-theme-view',
  templateUrl: './discount-applicable-theme-view.component.html'
})
export class DiscountApplicableThemeViewComponent {
  currentIndex = 1;
  @Input() config: NewDiscountApplicableTheme;

}
