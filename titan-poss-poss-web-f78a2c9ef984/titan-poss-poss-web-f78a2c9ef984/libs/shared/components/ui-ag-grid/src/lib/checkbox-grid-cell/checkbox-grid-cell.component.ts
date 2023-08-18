import { FormGroup } from '@angular/forms';
import { Component, HostListener } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-checkbox-gridcell',
  template: `
    <ng-container [formGroup]="rowFormGroup">
      <mat-checkbox
        [formControlName]="formControlName"
        (change)="selectionChange($event.checked)"
      >
      </mat-checkbox>
    </ng-container>
  `,
  styles: [':host { margin: auto;padding-top:10px }']
})
export class CheckboxGridCellComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  rowFormGroup: FormGroup;
  formControlName: string;
  selectAllRowKey = 'selectAll';

  private specialKeys: Array<string> = ['Tab'];

  refresh(params: any): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.rowFormGroup = params.data.formGroup;
    this.formControlName = this.params.colDef.field;
    if (this.params.context.disableCheckBox) {
      this.rowFormGroup.get(this.formControlName).disable();
    }
  }

  selectionChange(isChecked) {
    if (this.params.data.rowKey === this.selectAllRowKey) {
      this.params.context.componentParent.selectionChangeAll(
        isChecked,
        this.params.colDef.field
      );
    } else {
      this.params.context.componentParent.selectionChange(
        isChecked,
        this.params.data.rowKey,
        this.params.colDef.field
      );
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      event.stopPropagation();
      return;
    }
  }
}
