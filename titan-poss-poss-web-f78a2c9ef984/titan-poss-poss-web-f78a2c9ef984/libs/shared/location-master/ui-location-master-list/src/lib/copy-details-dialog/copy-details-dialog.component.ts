import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { EmitCopyLocationCodePayload } from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'poss-web-copy-details-dialog',
  templateUrl: './copy-details-dialog.component.html',
  styleUrls: ['./copy-details-dialog.component.scss']
})
export class CopyDetailsDialogComponent implements OnDestroy {
  @Output() emitCopyLocationData = new EventEmitter<
    EmitCopyLocationCodePayload
  >();


  constructor(
    public dialogRef: MatDialogRef<CopyDetailsDialogComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translationService
      .get(['pw.locationMapping.newLocationCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.locationCodeName = translatedMsg['pw.locationMapping.newLocationCode'];
      });
  }

  locationCodeName = 'New location code';
  destroy$ = new Subject();

  form = new FormGroup({
    locationCode: new FormControl('', [
      this.fieldValidatorsService.requiredField(this.locationCodeName),
      this.fieldValidatorsService.locationCodeField(this.locationCodeName),
      this.fieldValidatorsService.maxLength(20, this.locationCodeName)
    ])
  });


  clear() {
    this.form.reset();
  }
  create() {
    if (this.form.valid) {
      this.emitCopyLocationData.emit({
        oldLocationCode: this.data.locationCode,
        newLocationCode: this.form.value.locationCode
      });

      this.dialogRef.close({
        oldLocationCode: this.data.locationCode,
        newLocationCode: this.form.value.locationCode
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // omit_special_char($event: KeyboardEvent) {
  //   const pattern = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
  //   return pattern.test($event.key);
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
