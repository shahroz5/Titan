import { Component, Input } from '@angular/core';
import { EmpowerConfigItem } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discount-empower-config-view',
  templateUrl: './discount-empower-config-view.component.html'
})
export class DiscountEmpowerConfigViewComponent{
  @Input() empowerConfigDetailsList: EmpowerConfigItem[];


}
