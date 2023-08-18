import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TaxDetailsPopup,
  TaxDetailsConfig,
  TaxDetailsPopupFormData,
  TaxDetailsSubmit
} from '@poss-web/shared/models';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-tax-details-popup',
  templateUrl: './tax-details-popup.component.html',
  styleUrls: ['./tax-details-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxDetailsPopupComponent implements OnInit, OnDestroy {
  taxDetailsForm: FormGroup;
  dialogData: TaxDetailsPopup;
  stateTaxDetailsList: TaxDetailsConfig[];

  taxClassList: string[];
  filteredOptions: Observable<string[]>;

  destroy$ = new Subject<null>();
  taxClassName: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    public dialogRef: MatDialogRef<TaxDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaxDetailsPopup
  ) {
    this.dialogData = data;

    this.translationService
      .get(['pw.statetaxconfiguration.taxClass'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.taxClassName = translatedMsg['pw.statetaxconfiguration.taxClass'];
      });
  }

  ngOnInit() {
    this.dialogData.allTaxClassList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(taxClassList => {
        this.taxClassList = taxClassList;
      });

    this.dialogData.stateTaxDetailsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(taxList => {
        this.stateTaxDetailsList = taxList;

        this.initForm();
      });
  }

  initForm() {
    const taxClassSel: string[] = [];
    let taxClassData: { [key: string]: number };
    if (this.dialogData.mode) {
      this.stateTaxDetailsList.forEach(list => {
        if (list.isSelected) {
          taxClassData = list.taxDetails.data;

          taxClassSel.push(list.taxClassCode);
        }
      });
    }
    this.taxDetailsForm = new FormGroup({
      taxClass: new FormControl(taxClassSel, [
        this.fieldValidatorsService.requiredField(this.taxClassName)
      ]),
      taxComponentDetails: this.fb.array([])
    });

    this.dialogData.taxComponent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(taxList => {
        taxList.forEach(tc => {
          let taxClassVal = null;
          if (taxClassSel.length === 1) {
            taxClassVal = taxClassData[tc] ?? null;
          }

          this.taxComponentDetails.push(
            this.fb.group({
              taxComponentName: new FormControl(tc),
              taxComponent: new FormControl(taxClassVal, [
                this.fieldValidatorsService.percentageField(tc)
              ])
            })
          );
        });
      });

    //   this.filteredOptions = this.taxDetailsForm.get('taxClass').valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filter(value))
    //     );
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.taxClassList.filter(option => option.toLowerCase().includes(filterValue));
  // }

  get taxComponentDetails() {
    return this.taxDetailsForm.get('taxComponentDetails') as FormArray;
  }

  onSubmit() {
    if (this.taxDetailsForm.valid) {
      const values = this.taxDetailsForm.getRawValue();
      const submitValue: TaxDetailsSubmit = {};
      if (this.dialogData.mode) {
        const formDataValues: TaxDetailsPopupFormData[] = [];
        this.stateTaxDetailsList
          .filter(data => data.isSelected)
          .forEach(list => {
            if (values.taxClass.includes(list.taxClassCode)) {
              const data: { [key: string]: number } = {
                ...list.taxDetails.data
              };
              values.taxComponentDetails.forEach(
                (val: { taxComponentName: string; taxComponent: string }) => {
                  if (val.taxComponent !== null) {
                    data[val.taxComponentName] = +val.taxComponent;
                  }
                }
              );

              formDataValues.push({
                id: list.id,
                taxClassCode: list.taxClassCode,
                taxDetails: {
                  data: data
                }
              });
            }
          });
        submitValue.addStateTaxDetails = [];
        submitValue.updateStateTaxDetails = formDataValues;
      } else {
        const formDataValues: TaxDetailsPopupFormData[] = [];
        const data: { [key: string]: number } = {};
        values.taxComponentDetails.forEach(
          (val: { taxComponentName: string; taxComponent: string }) => {
            if (val.taxComponent !== null) {
              data[val.taxComponentName] = +val.taxComponent;
            } else {
              data[val.taxComponentName] = 0;
            }
          }
        );

        formDataValues.push({
          taxClassCode: values.taxClass,
          taxDetails: {
            data: data
          }
        });
        submitValue.addStateTaxDetails = formDataValues;
        submitValue.updateStateTaxDetails = [];
      }

      this.dialogRef.close(submitValue);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  getControls() {
    return (this.taxDetailsForm.get('taxComponentDetails') as FormArray)
      .controls;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// export function RequireMatch(control: AbstractControl) {
//   const selection: any = control.value;
//   if (typeof selection === 'string') {
//     return { incorrect: true };
//   }
//   return null;
// }

// export function RequireMatch(Services: any[]): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const index = Services.findIndex(Service => {
//       return new RegExp("^" + Service + "$").test(control.value);
//     });
//     return index < 0 ? { incorrect: { value: control.value } } : null;
//   };
// }
