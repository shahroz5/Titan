import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-gep-product-checkbox-cell',
  template: `
    <ng-container>
      <mat-checkbox

        (change)="selectionChange($event.checked)"
      >
      </mat-checkbox>
    </ng-container>
  `,
  styles: [':host { margin: auto;padding-top:10px }']
})
export class GepProductCheckboxCellComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;



  refresh(params: any): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {

    this.params = params;
    console.log(this.params)
  }


  selectionChange(isChecked) {
    this.params.data.melted=isChecked;
}
}
