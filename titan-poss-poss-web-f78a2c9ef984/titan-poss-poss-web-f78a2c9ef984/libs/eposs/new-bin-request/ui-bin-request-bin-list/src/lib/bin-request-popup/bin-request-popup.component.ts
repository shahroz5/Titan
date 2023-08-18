import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { BinRequestDto, BinRequestResponse } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-bin-request-popup',
  templateUrl: './bin-request-popup.component.html',
  styleUrls: ['./bin-request-popup.component.scss']
})
export class BinRequestPopupComponent {
  binLength = 20;
  newBinRequestForm = new FormGroup({
    bin: new FormControl(''),
    remarks: new FormControl('')
  });
  value: string;
  binRequest: BinRequestDto;

  requestedBinResponse: BinRequestResponse;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialogRef: MatDialogRef<BinRequestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BinRequestDto,
    public dialog: MatDialog,
    form: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.newBinRequestForm = form.group({
      bin: [
        '',
        // [
        //   Validators.required,
        //   Validators.maxLength(20),
        //   Validators.pattern('^[a-zA-Z0-9-.,_ ]+$')
        // ]
        [
          this.fieldValidatorsService.requiredField('Bin Name'),
          this.fieldValidatorsService.nameWithSpaceField('Bin Name')
        ]
      ],
      remarks: [
        '',
        // [
        //   Validators.required,
        //   Validators.maxLength(250),
        //   Validators.pattern('^[a-zA-Z0-9-.,_ ]*$')
        // ]
        [
          this.fieldValidatorsService.requiredField('Remarks'),
          this.fieldValidatorsService.remarkField('Remarks'),
          this.fieldValidatorsService.maxLength(250, 'Remarks')
        ]
      ]
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  requestBin() {
    this.binRequest = {
      bin: this.newBinRequestForm.get('bin').value,
      remarks: this.newBinRequestForm.get('remarks').value
    };

    if (this.newBinRequestForm.valid === true) {
      this.dialogRef.close(this.binRequest);
    } else {
      this.newBinRequestForm.markAllAsTouched();
    }
  }
}
