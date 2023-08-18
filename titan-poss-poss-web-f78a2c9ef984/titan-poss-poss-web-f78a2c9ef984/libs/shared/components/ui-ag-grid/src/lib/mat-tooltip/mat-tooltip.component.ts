import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-mat-tooltip',
  templateUrl: './mat-tooltip.component.html',
  styleUrls: ['./mat-tooltip.component.scss']
})
export class MatTooltipComponent implements ITooltipAngularComp {
  public params: any;
  private valueToDisplay: string;
  private isHeader: boolean;
  private isGroupedHeader: boolean;

  agInit(params): void {
    this.params = params;
  }
}
