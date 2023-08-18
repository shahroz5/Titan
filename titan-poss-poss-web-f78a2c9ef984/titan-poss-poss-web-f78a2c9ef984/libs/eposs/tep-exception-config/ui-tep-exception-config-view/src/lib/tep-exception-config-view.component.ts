import { Component, Input } from '@angular/core';
import { TEPExceptionConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-exception-config-view',
  templateUrl: './tep-exception-config-view.component.html',
  styleUrls: ['./tep-exception-config-view.component.scss']
})
export class TepExceptionConfigViewComponent  {


  @Input() tepExceptionConfigDetails: TEPExceptionConfig;
  expanded = true;



  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
