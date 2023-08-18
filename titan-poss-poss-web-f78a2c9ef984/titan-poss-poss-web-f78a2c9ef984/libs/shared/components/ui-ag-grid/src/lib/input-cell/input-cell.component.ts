import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-input-cell',
  template: `
    <ng-container [formGroup]="rowFormGroup">
      <mat-form-field>
        <input matInput [type]="check" [formControlName]="formControlName" />
        <mat-icon matSuffix (click)="visibility()"
          ><span
            *ngIf="check === 'password'"
            class="pw-i-16 pw-eye-hide-icon-16"
          ></span>
          <span *ngIf="check === 'text'" class="pw-i-16 pw-eye-icon-16"></span>
        </mat-icon>
      </mat-form-field>
    </ng-container>
  `
})
export class InputCellComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  rowFormGroup: FormGroup;
  formControlName: string;
  hide = true;
  check = 'password';

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.rowFormGroup = params.data.formGroup;
    this.formControlName = this.params.colDef.field;
    if (this.params.context.disableInput) {
      this.rowFormGroup.get(this.formControlName).disable();
    }
  }
  visibility() {
    this.hide = !this.hide;
    if (this.hide) {
      this.check = 'password';
    } else this.check = 'text';
  }

  // selectionChange(event: any) {
  //   this.params.context.selectionChange(this.params.data);
  // }

  refresh(params: any): boolean {
    return false;
  }
}
