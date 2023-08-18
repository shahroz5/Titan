import { Component, Input } from '@angular/core';
import { IbtConfigurationResponse } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ibt-config-view',
  templateUrl: './ibt-config-view.component.html',
  styleUrls: ['./ibt-config-view.component.scss']
})
export class IbtConfigViewComponent  {

  @Input() ibtConfiguration: IbtConfigurationResponse;


}
