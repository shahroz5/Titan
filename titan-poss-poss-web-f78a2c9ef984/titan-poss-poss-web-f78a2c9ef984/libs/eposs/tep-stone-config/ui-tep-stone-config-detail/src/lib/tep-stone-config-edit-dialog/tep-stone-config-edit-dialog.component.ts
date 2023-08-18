import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  TEPStoneConfigDetails,
  TEPStoneConfigGridEnum,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-stone-config-edit-dialog',
  templateUrl: './tep-stone-config-edit-dialog.component.html',
  styles: []
})
export class TepStoneConfigEditDialogComponent implements OnInit {
  deductionPercentTranslate: string;
  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    public dialogRef: MatDialogRef<TepStoneConfigEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TEPStoneConfigDetails[]
  ) {
    this.translationService
      .get(['pw.tepStoneConfig.deductionPercentTranslate'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.deductionPercentTranslate =
          translatedMsg['pw.tepStoneConfig.deductionPercentTranslate'];
      });
  }

  destroy$: Subject<null> = new Subject<null>();

  tepStoneConfigEditForm: FormGroup;
  ngOnInit(): void {
    this.tepStoneConfigEditForm = new FormGroup({
      dedutionPercent: new FormControl(
        this.data.length === 1 ? this.data[0].dedutionPercent : '',
        [
          this.fieldValidatorsService.requiredField(
            this.deductionPercentTranslate
          ),
          this.fieldValidatorsService.percentageField(
            this.deductionPercentTranslate
          )
        ]
      )
    });
  }

  onSubmit() {
    if (this.tepStoneConfigEditForm.valid) {
      const formData = this.tepStoneConfigEditForm.getRawValue();

      const updateStones: TEPStoneConfigDetails[] = this.data.map(a => {
        a.dedutionPercent = formData.dedutionPercent;
        delete a.configId;
        delete a.range;
        return a;
      });
      const updatedStoneDetails: TEPStoneDetailsModify = {
        updateStones
      };
      const submitData = {
        mode: TEPStoneConfigGridEnum.EDIT,
        formData: updatedStoneDetails
      };
      this.dialogRef.close(submitData);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
