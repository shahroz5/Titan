import { Component, Input } from '@angular/core';

@Component({
  selector: 'poss-web-top-info-panel',
  templateUrl: './top-info-panel.component.html',
  styleUrls: ['./top-info-panel.component.scss']
})
export class TopInfoPanelComponent {
  @Input() isFocusing: boolean;
  @Input() focusedHeaderName: string;
  @Input() currentRowData: any;
}
