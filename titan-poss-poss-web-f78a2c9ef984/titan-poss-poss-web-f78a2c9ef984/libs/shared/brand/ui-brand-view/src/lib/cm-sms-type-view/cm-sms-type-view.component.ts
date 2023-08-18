import { Component, Input } from '@angular/core';
import { BrandMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cm-sms-type-view',
  templateUrl: './cm-sms-type-view.component.html',
  styles: []
})
export class CmSmsTypeViewComponent  {

  @Input() brandMasterDetails: BrandMasterDetails;


}
