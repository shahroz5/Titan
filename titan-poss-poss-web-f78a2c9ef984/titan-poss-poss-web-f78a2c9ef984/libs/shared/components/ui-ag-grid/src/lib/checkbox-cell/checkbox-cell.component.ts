import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-checkbox-cell',
  template: `
    <mat-checkbox
      [formControl]="fromControl"
      (change)="selectionChange($event.checked)"
      (keydown)="$event.preventDefault()"
    >
    </mat-checkbox>
  `,
  styles: [':host { margin: auto;padding-top:10px }']
})
export class CheckboxCellComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  fromControl: FormControl;


  refresh(params: any): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.fromControl = new FormControl(this.params.value);
    if (this.params.context.disableCheckBox) {
      this.fromControl.disable();
    }
  }

  selectionChange(isChecked) {
    if (this.params.context?.componentParent?.checkBoxSelectionChange)
      this.params.context.componentParent.checkBoxSelectionChange(
        isChecked,
        this.params
      );
  }
}
