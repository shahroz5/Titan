import { Component, Input } from '@angular/core';
import { TEPValidationConfigResult } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-validation-config-details-view',
  templateUrl: './tep-validation-config-details-view.component.html',
  styleUrls: ['./tep-validation-config-details-view.component.scss']
})
export class TepValidationConfigDetailsViewComponent {

  @Input() tepValidationConfigResult: TEPValidationConfigResult;

}
