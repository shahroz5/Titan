import { Component, Input } from '@angular/core';
import { TEPExceptionConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-exception-config-name-view',
  templateUrl: './tep-exception-config-name-view.component.html'
})
export class TepExceptionConfigNameViewComponent {
  @Input() tepExceptionConfigDetails: TEPExceptionConfig;
}
