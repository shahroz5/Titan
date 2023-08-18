import { Component, Input} from '@angular/core';
import {
  TEPValidationConfigResult
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-validation-config-view',
  templateUrl: './tep-validation-config-view.component.html',
  styleUrls: ['./tep-validation-config-view.component.scss']
})
export class TepValidationConfigViewComponent  {


  @Input() tepValidationConfigResult: TEPValidationConfigResult;
  expanded = true;



  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
