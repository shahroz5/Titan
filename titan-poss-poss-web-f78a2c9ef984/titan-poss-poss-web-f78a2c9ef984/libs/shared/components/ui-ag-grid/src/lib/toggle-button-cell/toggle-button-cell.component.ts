import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-payer-banks-cell',
  template: `
    <ng-container>
      <poss-web-toggle-button
        [isActive]="this.params.data.isActive"
        (changeEvent)="selectionChange($event.checked)"
        [isDisabled]="
          this.params.context.disableToggleButton
            ? this.params.context.disableToggleButton
            : false
        "
      >
      </poss-web-toggle-button>
    </ng-container>
  `,
  styles: [':host { padding-top:10px }']
})
export class ToggleButtonCellComponent implements ICellRendererAngularComp {
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
    // this.params.data = { ...this.params.data, isActive: checked };
    if (this.params.context.componentParent.selectionChange) {
        this.params?.context?.componentParent.selectionChange(
          this.params.data.id,
          checked,
          this.params.data
        );
    }
    this.params.data.isActive = checked;
  }
}
