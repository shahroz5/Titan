import { Component, Input, OnInit } from '@angular/core';
import { TranslatorService } from '../../services/translator.service';

@Component({
  selector: 'poss-web-error-message',
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent implements OnInit {
  @Input() formId: string;
  @Input() controlName: string;
  @Input() error: string;
  @Input() validationErrorMessages: {
    errorType: string;
    errorMessage: string;
  }[];

  message: string;

  constructor(private translatorService: TranslatorService) {}

  ngOnInit(): void {
    let key = '';
    try {
      key = this.validationErrorMessages.length
        ? this.validationErrorMessages.filter(
            err => err.errorType === this.error
          )[0].errorMessage
        : null;
    } catch (e) {
      key = null;
    }
    if (key === null || key === '') {
      key = 'pw.inventoryMasterValidation.default' + '_' + this.error;
    }

    if (
      this.formId !== undefined &&
      this.controlName !== undefined &&
      this.error !== undefined
    ) {
      this.translatorService.getErrorMessage(key).then(mess => {
        this.message = mess;
      });
    } else {
      if (this.formId !== undefined && this.error !== undefined) {
        this.translatorService.getErrorMessage(key).then(mess => {
          this.message = mess;
        });
      }
    }
  }
}
