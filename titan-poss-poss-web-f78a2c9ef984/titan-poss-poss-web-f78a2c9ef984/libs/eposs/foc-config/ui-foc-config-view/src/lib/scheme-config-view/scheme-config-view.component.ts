import { Component, Input } from '@angular/core';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-scheme-config-view',
  templateUrl: './scheme-config-view.component.html',
  styleUrls: ['./scheme-config-view.component.scss']
})
export class SchemeConfigViewComponent {

  @Input() schemeDetails: SchemeDetails;

}
