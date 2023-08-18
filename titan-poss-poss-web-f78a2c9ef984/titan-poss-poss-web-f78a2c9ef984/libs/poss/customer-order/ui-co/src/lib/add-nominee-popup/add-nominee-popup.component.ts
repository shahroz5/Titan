import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NomineeDetails, SelectDropDownOption } from '@poss-web/shared/models';

export interface NomineeData {
  isSave: boolean;
  nomineeDetails: NomineeDetails;
}
@Component({
  selector: 'poss-web-add-nominee-popup',
  templateUrl: './add-nominee-popup.component.html',
  styleUrls: ['./add-nominee-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNomineePopupComponent implements OnInit, OnDestroy {
  nomineeForm: FormGroup;
  relationshipOptions = [];
  nomineeNameLabel: string;
  addressLabel: string;
  mobileNumberLabel: string;
  relationshipLabel: string;
  addedData: NomineeDetails;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialogRef: MatDialogRef<AddNomineePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      addedNomineeDetails: NomineeDetails;
      relationshipTypes: SelectDropDownOption[];
    },
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.addNominee.nomineeNameLabel',
        'pw.addNominee.addressLabel',
        'pw.addNominee.mobileNumberLabel',
        'pw.addNominee.relationshipLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.nomineeNameLabel =
          translatedMessages['pw.addNominee.nomineeNameLabel'];
        this.addressLabel = translatedMessages['pw.addNominee.addressLabel'];
        this.mobileNumberLabel =
          translatedMessages['pw.addNominee.mobileNumberLabel'];
        this.relationshipLabel =
          translatedMessages['pw.addNominee.relationshipLabel'];
      });
    this.addedData = data.addedNomineeDetails;
    this.relationshipOptions = data.relationshipTypes;
  }

  ngOnInit(): void {
    this.createNomineeForm();
  }

  createNomineeForm() {
    this.nomineeForm = new FormGroup({
      nomineeName: new FormControl(
        this.addedData?.nomineeName ? this.addedData?.nomineeName : null,
        [
          this.fieldValidatorsService.customerNameField(this.nomineeNameLabel),
          this.fieldValidatorsService.requiredField(this.nomineeNameLabel)
        ]
      ),
      address: new FormControl(
        this.addedData?.address ? this.addedData?.address : null,
        [
          this.fieldValidatorsService.addressField(this.addressLabel),
          this.fieldValidatorsService.requiredField(this.addressLabel)
        ]
      ),
      mobileNumber: new FormControl(
        this.addedData?.mobileNumber ? this.addedData?.mobileNumber : null,
        [
          this.fieldValidatorsService.mobileField(this.mobileNumberLabel),
          this.fieldValidatorsService.requiredField(this.mobileNumberLabel)
        ]
      ),
      relationship: new FormControl(
        this.addedData?.relationship ? this.addedData?.relationship : null,
        [this.fieldValidatorsService.requiredField(this.relationshipLabel)]
      )
    });
  }

  closePopup(): void {
    this.dialogRef.close({
      isSave: false,
      nomineeDetails: this.nomineeForm.value
    });
  }

  saveData() {
    this.dialogRef.close({
      isSave: true,
      nomineeDetails: this.nomineeForm.value
    });
  }

  cancel() {
    this.dialogRef.close({
      isSave: false,
      nomineeDetails: this.nomineeForm.value
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
