import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { POSS_WEB_MAX_FILTER_OPTION_SELECTION } from '@poss-web/shared/util-config';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-set-limit-tab',
  templateUrl: './set-limit-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetLimitTabComponent implements OnInit, OnDestroy {
  eleventhDigit;
  occasion;
  formData: FormGroup;
  destroy$ = new Subject<null>();
  dialogData;
  eleventhDigitLabel: string;
  grammageLabel: string;
  occasionLabel: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<SetLimitTabComponent>,
    private translationService: TranslateService,
    @Inject(POSS_WEB_MAX_FILTER_OPTION_SELECTION)
    public maxFilterOptionsSelection,
    @Inject(MAT_DIALOG_DATA) 
    public data: any
  ) {
    this.occasion = data.occasionLov?.map(data1 => ({
      value: data1.value,
      description: data1.value
    }));

    this.eleventhDigit = data.eleventhDigitLov;
  }

  ngOnInit(): void {
    this.translationService
      .get([
        'pw.rivaahEligibilityConfig.11thDigit',
        'pw.rivaahEligibilityConfig.grammage',
        'pw.rivaahEligibilityConfig.occasion'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.eleventhDigitLabel =
          translatedMsg['pw.rivaahEligibilityConfig.11thDigit'];
        this.grammageLabel =
          translatedMsg['pw.rivaahEligibilityConfig.grammage'];
        this.occasionLabel =
          translatedMsg['pw.rivaahEligibilityConfig.occasion'];
      });

    this.formData = new FormGroup({
      eleventhDigit: new FormControl(
        this.data?.eleventhDigit ? this.data?.eleventhDigit : '',
        this.fieldValidatorsService.requiredField(this.eleventhDigitLabel)
      ),
      grammage: new FormControl(
        this.data?.grammage ? this.data?.grammage : '',
      this.fieldValidatorsService.requiredField(this.grammageLabel)
      ),
      occasion: new FormControl(
        this.data?.occasion ? this.data?.occasion : '',
        this.fieldValidatorsService.requiredField(this.occasionLabel)
      )
    });
  }

  save() {
    this.dialogRef.close({
      type: 'save',
      data: {
        eleventhDigit: this.formData.get('eleventhDigit').value,
        grammage: this.formData.get('grammage').value,
        occasion: this.formData.get('occasion').value
      }
    });
  }

  getLableWithSelectedOptionsCount(
    formControlName: string,
    placeholder: string
  ): string {
    if (
      this.formData &&
      this.formData.get(formControlName) &&
      this.formData.get(formControlName).value &&
      this.formData.get(formControlName).value.length
    ) {
      return (
        placeholder +
        ' (' +
        this.formData.get(formControlName).value.length +
        ')'
      );
    } 
    else {
      return placeholder;
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
