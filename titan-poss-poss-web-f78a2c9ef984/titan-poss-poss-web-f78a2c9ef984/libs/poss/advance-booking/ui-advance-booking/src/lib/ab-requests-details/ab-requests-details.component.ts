import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AdvanceBookingDetailsResponse } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-ab-requests-details',
  templateUrl: './ab-requests-details.component.html'
})
export class AbRequestsDetailsComponent implements OnInit, OnChanges {
  @Input() advanceBookingDetailsResponse: AdvanceBookingDetailsResponse;
  @Input() currencyCode: string;
  @Input() rsoDetails;
  @Input() actionType;

  @Input() clearPage;
  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('reason', { static: true })
  reason: ElementRef;

  requestDetailForm: FormControl;
  constructor(
    form: FormBuilder,
    private fieldValidator: FieldValidatorsService
  ) {
    this.requestDetailForm = new FormControl('', [
      this.fieldValidator.remarkField('reason'),
      this.fieldValidator.requiredField('reason')
    ]);
  }

  dateFormat(value) {
    return moment(value);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['clearPage'] && changes['clearPage'].currentValue === true) {
      this.requestDetailForm.markAllAsTouched();
      this.ScrollIntoView('#reason');
    }
    if (changes['clearPage'] && changes['clearPage'].currentValue === false) {
      this.requestDetailForm.markAllAsTouched();
      this.ScrollIntoView('#reason');
    }
  }

  ScrollIntoView(elem: string) {
    document
      .querySelector(elem)
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  formEmit() {
    if (this.requestDetailForm) {
      this.formSubmit.emit({
        remarks: this.requestDetailForm.valid
          ? this.requestDetailForm.value
          : null
      });
    }
  }
  ngOnInit(): void {
    console.log(this.rsoDetails, 'rso');
    if (this.actionType === 'cancel-request') {
      this.requestDetailForm
        .get('reason')
        .setValidators([this.fieldValidator.requiredField('reason')]);
    }
  }
}
