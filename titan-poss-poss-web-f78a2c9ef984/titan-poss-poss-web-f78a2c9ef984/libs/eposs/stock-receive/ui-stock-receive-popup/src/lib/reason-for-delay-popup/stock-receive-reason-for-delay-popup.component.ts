import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-stock-receive-reason-for-delay-popup',
  templateUrl: './stock-receive-reason-for-delay-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReceiveReasonForDelayPopupComponent implements OnInit {
  @ViewChild('textareaRef', { static: true })
  private textareaRef: ElementRef<any>;

  reasonForDelayForm: FormGroup;
  reasonForDelayLabel: string;

  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<StockReceiveReasonForDelayPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get(['pw.stockReceive.reasonForDelayPopupPlaceholder'])
      .subscribe((translatedMessages: any) => {
        this.reasonForDelayLabel =
          translatedMessages['pw.stockReceive.reasonForDelayPopupPlaceholder'];
      });
    this.reasonForDelayForm = new FormGroup({
      reason: new FormControl(null, [
        this.fieldValidatorsService.reasonField(this.reasonForDelayLabel),
        this.fieldValidatorsService.requiredField(this.reasonForDelayLabel)
      ])
    });
  }

  ngOnInit() {
    if (this.textareaRef) {
      this.textareaRef.nativeElement.focus();
    }
    this.reasonForDelayForm.get('reason').valueChanges.subscribe(x => {
      if (this.reasonForDelayForm.get('reason').dirty && this.reasonForDelayForm.get('reason').untouched) {
        this.reasonForDelayForm.get('reason').markAsTouched();
      }
    })
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  confirm() {
    if (this.reasonForDelayForm.valid) {
      this.dialogRef.close({
        type: 'confirm',
        data: String(this.reasonForDelayForm.get('reason').value).trim()
      });
    }
  }
}
