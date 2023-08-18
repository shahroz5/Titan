import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-radio-button-cell',
  template: `
    <ng-container>
      <mat-radio-button
        (change)="selectionChange($event.checked)"
        (keydown)="$event.preventDefault()"
      >
      </mat-radio-button>
    </ng-container>
  `,
  styles: [':host { margin: auto;padding-top:10px }']
})
export class RadioButtonCellComponent implements ICellRendererAngularComp {
  isActive = false;
  params: ICellRendererParams;
  rowFormGroup: FormGroup;
  formControlName: string;
  isDisabled = true;
  refresh(params: any): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  selectionChange(checked) {
    this.params.context.componentParent.selectionChange(this.params.data);
  }
}
