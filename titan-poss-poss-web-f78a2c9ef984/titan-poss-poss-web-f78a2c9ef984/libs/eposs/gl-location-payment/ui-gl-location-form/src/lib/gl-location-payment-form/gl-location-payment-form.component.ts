import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { FormGroup, FormControl } from '@angular/forms';
import {
  LocationMappingServiceAbstraction,
  LocationMappingServiceResponse
} from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-gl-location-payment-form',
  templateUrl: './gl-location-payment-form.component.html'
})
export class GlLocationPaymentFormComponent  {
  @Input() paymentCodes;
  @Output() formData = new EventEmitter<any>();
  onFormSubmit: FormGroup;
  locationsAdded: any[];
  locations: boolean;
  destroy$ = new Subject<null>();
  constructor(
    private locationMappingService: LocationMappingServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.onFormSubmit = new FormGroup({
      locations: new FormControl(
        { value: '', disabled: true },
        this.fieldValidatorsService.requiredField('Location ')
      ),
      paymentCode: new FormControl(
        '',
        this.fieldValidatorsService.requiredField('Payment Code')
      ),
      glCode: new FormControl('', [
        this.fieldValidatorsService.fitGlCodeField('GL Code'),
        this.fieldValidatorsService.requiredField('GL Code')
      ])
    });
  }

  addLocations() {
    this.locationMappingService
      .open({
        selectedLocations: []
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: LocationMappingServiceResponse) => {
        if (res.type === 'apply') {
          this.locationsAdded = [];
          this.locationsAdded = res.data.addedLocations.map(l => l.id);
          this.locations = true;
          const countadded = this.locationsAdded.length;
          if (countadded > 1) {
            this.onFormSubmit.patchValue({
              locations:
                this.locationsAdded[0] + ' (+' + (countadded - 1) + ' others)'
            });
          } else if (countadded === 1) {
            this.onFormSubmit.patchValue({
              locations: this.locationsAdded[0]
            });
          }
        }
      });
  }
  saveDetails() {
    const values = this.onFormSubmit.getRawValue();

    const paymentCodes = [];
    paymentCodes.push({
      paymentCode: values.paymentCode,
      glCode: values.glCode
    });
    this.formData.emit({
      addLocations: this.locationsAdded,
      addPaymentCodes: paymentCodes,
      removePaymentCodes: [],
      removeLocations: [],
      updatePaymentCodes: []
    });

    this.locationsAdded = [];

    this.onFormSubmit.patchValue({
      paymentCode: null,
      glCode: null,
      locations: null
    });
    this.onFormSubmit.get('paymentCode').markAsUntouched();
    this.onFormSubmit.get('glCode').markAsUntouched();
  }
}
