import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-toggle-cell',
  template: `
    <ng-container>
      <mat-slide-toggle [disabled]="true" [checked]="params.value.checked"
        ><span>{{ params.value.text }}</span>
      </mat-slide-toggle>
    </ng-container>
  `
})
export class MatToggleRender implements ICellRendererAngularComp {
  params: ICellRendererParams;
  checked: boolean;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  // demonstrates how you can do "inline" editing of a cell

  refresh(params: any): boolean {
    return false;
  }
}
