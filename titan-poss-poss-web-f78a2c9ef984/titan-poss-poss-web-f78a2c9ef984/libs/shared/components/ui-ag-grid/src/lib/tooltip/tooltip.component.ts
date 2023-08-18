import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';

const selectRSO = 'Select RSO';

@Component({
  selector: 'poss-web-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements ITooltipAngularComp {
  description = null;

  agInit(params: any): void {
    this.description = params.value;
  }
}
