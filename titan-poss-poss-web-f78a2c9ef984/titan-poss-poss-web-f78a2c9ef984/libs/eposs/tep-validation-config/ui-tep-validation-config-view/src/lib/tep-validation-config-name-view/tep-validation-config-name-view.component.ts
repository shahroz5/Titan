import { Component, Input } from '@angular/core';
import { TEPValidationConfigResult } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-validation-config-name-view',
  templateUrl: './tep-validation-config-name-view.component.html',
  styleUrls: ['./tep-validation-config-name-view.component.scss']
})
export class TepValidationConfigNameViewComponent  {

  @Input() tepValidationConfigResult: TEPValidationConfigResult;


}
