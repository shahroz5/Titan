import { Component, Inject } from '@angular/core';
import {
  BinRequestApprovalsItems,
  BinApprovals
} from '@poss-web/shared/models';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-bin-request-approvals-popup',
  templateUrl: './bin-request-approvals-popup.component.html',
  styleUrls: ['./bin-request-approvals-popup.component.scss']
})
export class BinRequestApprovalsPopupComponent {
  newBinRequestForm: FormGroup;

  binApproval: BinApprovals;
  constructor(
    public dialogRef: MatDialogRef<BinRequestApprovalsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BinRequestApprovalsItems,
    public dialog: MatDialog,
    form: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.newBinRequestForm = form.group({
      remarks: [
        '',
        [
          this.fieldValidatorsService.remarkField('Remarks'),
          this.fieldValidatorsService.maxLength(250, 'Remarks')
        ]
        // [Validators.maxLength(250), Validators.pattern('^[a-zA-Z0-9-.,_ ]*$')]
      ]
    });

    if (data.status === 'reject') {
      this.newBinRequestForm.get('remarks').setValidators(
        // [Validators.required, Validators.maxLength(250)]
        [
          this.fieldValidatorsService.remarkField('Remarks'),
          this.fieldValidatorsService.requiredField('Remarks'),
          this.fieldValidatorsService.maxLength(250, 'Remarks')
        ]
      );
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  approvedRejected(status: string) {
    if (status === 'approve') {
      this.binApproval = {
        remarks: this.newBinRequestForm.get('remarks').value,
        status: 'APPROVED'
      };
    } else if (status === 'reject') {
      this.binApproval = {
        remarks: this.newBinRequestForm.get('remarks').value,
        status: 'APVL_REJECTED'
      };
    }
    if (this.newBinRequestForm.valid === true) {
      this.dialogRef.close(this.binApproval);
    } else {
      this.newBinRequestForm.markAllAsTouched();
    }
  }

  clearRemarks() {
    this.newBinRequestForm.reset();
  }
}
