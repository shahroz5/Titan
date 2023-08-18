import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { SelectDropDownOption } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-add-foc-popup',
  templateUrl: './add-foc-popup.component.html',
  styleUrls: ['./add-foc-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFocPopupComponent implements OnInit, OnDestroy {
  resetForm$: Subject<any> = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();
  form: FormGroup;
  parentForm: FormArray;
  hasPendingFlow = true;
  focData = [];
  // selectedIndex = 1;
  tabIndex = 0;

  rsoNamesArray: SelectDropDownOption[] = [];
  constructor(
    public fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<AddFocPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      focData: any;
      isPendingRequired: boolean;
      rsoNames: { code: string; name: string }[];
      selectedRso: string;
    },
    public fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      parentForm: new FormArray([]),
      rsoName: new FormControl(
        this.data.selectedRso ? this.data.selectedRso : '',
        this.fieldValidatorsService.requiredField('RSO Name')
      )
    });

    this.hasPendingFlow = this.data.isPendingRequired;
    this.focData = [];
    this.focData = this.data.focData;
  }

  ngOnInit(): void {
    this.rsoNamesArray = [];
    for (const rso of this.data.rsoNames) {
      this.rsoNamesArray.push({
        value: rso.code,
        description: `${rso.name} - ${rso.code}`
      });
    }
  }
  addFoc() {
    this.form.markAllAsTouched();
    if (
      this.form &&
      this.form.touched &&
      this.form.controls?.parentForm &&
      this.getControls()[this.tabIndex] &&
      this.getControls()[this.tabIndex].valid &&
      this.form.controls.parentForm.invalid
    ) {
      this.dialogRef.close({ type: 'showAlert', data: this.form.value });
    } else if (this.form.valid) {
      this.dialogRef.close({ type: 'addFoc', data: this.form });
    }
  }

  reset() {
    this.resetForm$.next();
    this.form.patchValue({ rsoName: null });
    this.form.markAsUntouched();
  }

  closePopup(): void {
    this.dialogRef.close(null);
  }
  keepFocPending() {
    this.dialogRef.close({ type: 'pendingFOC', data: null });
  }
  getControls() {
    return (this.form.get('parentForm') as FormArray).controls;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateTab(tabIndex: number) {
    this.tabIndex = tabIndex;
  }
  getPurchaseItems(purchaseItems) {
    const focItems = [];
    purchaseItems.forEach(item => {
      item.focItemDetails.forEach(code => {
        focItems.push(code.itemCode);
      });
    });
    return focItems;
  }
}
