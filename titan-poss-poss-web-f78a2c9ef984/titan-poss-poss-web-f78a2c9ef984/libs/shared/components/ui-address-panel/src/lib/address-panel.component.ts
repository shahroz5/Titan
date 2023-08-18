import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import {
  map,
  startWith,
  takeUntil,
  debounceTime,
  tap,
  filter
} from 'rxjs/operators';

import {
  TownSummary,
  StateSummary,
  CountrySummary,
  PincodeSummary,
  AddressDetail,
  CUSTOMER_TYPE_ENUM
} from '@poss-web/shared/models';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'poss-web-address-panel',
  templateUrl: './address-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressPanelComponent implements OnInit, OnChanges, OnDestroy {
  @Input() submitted$: Subject<boolean>;
  @Input() getStateData$: Subject<boolean>;
  @Input() resetForm$: Subject<boolean>;
  @Input() pincodeSummary: PincodeSummary;
  @Input() countryCode: any;
  @Output() loadAddressForm = new EventEmitter<FormGroup>();
  @Output() loadCountryId = new EventEmitter<string>();
  @Output() loadStateId = new EventEmitter<string>();
  @Output() loadPincodes = new EventEmitter<any>();
  @Output() loadCatchmentAreas = new EventEmitter<any>();
  @Output() loadStateData = new EventEmitter<any>();
  @Input() countryList: any[];
  @Input() stateList: any[];
  @Input() townList: TownSummary[];
  @Input() addressDetail: AddressDetail;
  @Input() viewMode: boolean;
  @Input() customerType: string;

  @ViewChild(MatAutocompleteTrigger)
  trigger: MatAutocompleteTrigger;

  destroy$ = new Subject();

  @ViewChild('titleInput', { static: false })
  titleInput: MatInput;

  addressForm: FormGroup;
  filteredCountryOptions$: Observable<any[]>;
  filteredStateOptions$: Observable<any[]>;
  filteredCityOptions$: Observable<any[]>;
  subscription: Subscription;
  selectedCountry: any;
  selectedCountryIdValue: any;
  selectedStateIdValue: any;
  countryByCode: any;
  country: any;
  countryLabel: string;
  addressLine1Label: string;
  addressLine2Label: string;
  addressLine3Label: string;
  pincodeLabel: string;
  cityLabel: string;
  stateLabel: string;
  countryListToDropdown: any;
  @ViewChild('auto') matAutocomplete: ElementRef<HTMLInputElement>;
  showAutocomplete: boolean;
  formSubmitted: boolean;

  @ViewChild('firstname') nameInput: MatInput;

  constructor(
    public translate: TranslateService,
    private formbuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.addressPanel.countryLabel',
        'pw.addressPanel.addressLine1Label',
        'pw.addressPanel.addressLine2Label',
        'pw.addressPanel.addressLine3Label',
        'pw.addressPanel.pincodeLabel',
        'pw.addressPanel.cityLabel',
        'pw.addressPanel.stateLabel'
      ])
      .subscribe((translatedLabels: any) => {
        this.countryLabel = translatedLabels['pw.addressPanel.countryLabel'];
        this.addressLine1Label =
          translatedLabels['pw.addressPanel.addressLine1Label'];
        this.addressLine2Label =
          translatedLabels['pw.addressPanel.addressLine2Label'];
        this.addressLine3Label =
          translatedLabels['pw.addressPanel.addressLine3Label'];
        this.pincodeLabel = translatedLabels['pw.addressPanel.pincodeLabel'];
        this.cityLabel = translatedLabels['pw.addressPanel.cityLabel'];
        this.stateLabel = translatedLabels['pw.addressPanel.stateLabel'];
      });
  }

  ngOnInit() {
    this.createAddressForm();
    setTimeout(() => {
      this.submitted$.pipe(takeUntil(this.destroy$)).subscribe(val => {
        if (val) {
          if (this.addressForm.valid) {
            const addressFormValues = this.addressForm.getRawValue();
            // if (typeof addressFormValues.country == 'object') {
            //   addressFormValues.country = addressFormValues.country.description;
            // }
            // if (typeof addressFormValues.state == 'object') {
            //   addressFormValues.state = addressFormValues.state.description;
            // }
            if (this.customerType !== 'INTERNATIONAL') {
              const selectedState = this.stateList.find(
                state => state.value === this.addressForm.get('state').value
              );
              if (selectedState) {
                addressFormValues.state = selectedState.description;
              }
            }

            this.loadAddressForm.emit(addressFormValues);
          } else {
            Object.keys(this.addressForm.controls).forEach(field => {
              const control = this.addressForm.get(field);
              if (control instanceof FormControl) {
                control.markAsTouched();
              }
            });
            this.nameInput.focus();
          }
        } else {
          this.createAddressForm();
          this.selectedCountryIdValue = '';
          this.allValueChanges();
        }
      });
    }, 10);

    this.getStateData$.pipe(takeUntil(this.destroy$)).subscribe(bool => {
      if (bool && this.addressForm.get('state').value) {
        const selectedState = this.stateList.find(
          state => state.value === this.addressForm.get('state').value
        );
        if (selectedState) {
          this.loadStateData.emit(selectedState);
        }
      }
    });

    this.resetForm$.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if (val) {
        this.addressForm.reset();
        this.countryByCode = this.countryList.find(
          country => country.value === 'IND'
        );
        if (this.countryByCode && this.addressForm) {
          this.addressForm.controls['country'].patchValue(
            this.countryByCode.description
          );
          this.country = this.countryByCode.description;
          this.selectedCountryId(null, this.countryByCode.value);
          if (this.customerType !== CUSTOMER_TYPE_ENUM.INTERNATIONAL) {
            this.selectedCountryIdValue = this.countryCode;
          }
        }
      }
    });

    this.allValueChanges();
  }

  allValueChanges() {
    this.addressForm
      .get('pincode')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(pincode => pincode && this.addressForm.get('pincode').valid),
        debounceTime(1000)
      )
      .subscribe(pincode => {
        if (
          pincode &&
          this.addressForm.get('pincode').valid &&
          this.selectedCountryIdValue
        ) {
          if (this.customerType !== CUSTOMER_TYPE_ENUM.INTERNATIONAL) {
            this.loadPincodes.emit({
              countryCode: this.selectedCountryIdValue,
              pincode: this.addressForm.get('pincode').value
            });
          }
        }
      });

    this.filteredCountryOptions$ = this.addressForm.controls[
      'country'
    ].valueChanges.pipe(
      startWith(''),
      tap(countrys => {
        if (
          (countrys !== null && countrys !== undefined && countrys !== '') ||
          (this.selectedCountryIdValue !== null &&
            this.selectedCountryIdValue !== undefined &&
            this.selectedCountryIdValue !== '')
        ) {
          if (!this.addressDetail) {
            this.addressForm.get('state').enable();
            this.addressForm.get('pincode').enable();
            this.selectionChangeCountry();
          }
        } else {
          if (!this.addressDetail) {
            this.addressForm.patchValue({
              state: '',
              pincode: '',
              city: ''
            });
            this.addressForm.get('state').disable();
            this.addressForm.get('pincode').disable();
            this.addressForm.get('city').disable();
          }
        }
      }),
      map(value => (typeof value === 'string' ? value : value.description)),
      map(description =>
        description
          ? this._filterCountry(description)
          : this.countryList.slice()
      )
    );

    this.filteredStateOptions$ = this.addressForm.controls[
      'state'
    ].valueChanges.pipe(
      startWith(''),
      tap(states => {
        if (
          states !== null &&
          states !== undefined &&
          states !== '' &&
          states.description !== ''
        ) {
          this.addressForm.get('city').enable();
          this.addressForm.controls['city'].markAsTouched();
          const selectedState = this.stateList.find(
            state => state.description === this.addressForm.get('state').value
          );
          if (selectedState) {
            this.loadStateData.emit(selectedState);
          }
        } else {
          if (!this.addressDetail) {
            this.addressForm.patchValue({
              city: ''
            });
            this.addressForm.get('city').disable();
          }
        }
      }),
      map(value => (typeof value === 'string' ? value : value.description)),
      map(description =>
        description ? this._filterState(description) : this.stateList.slice()
      )
    );

    //  else {
    //   this.addressForm.controls['state'].valueChanges.subscribe(states => {
    //     if (states !== null && states !== undefined && states !== '') {
    //       this.addressForm.get('city').enable();
    //       this.addressForm.controls['city'].markAsTouched();
    //       const selectedState = this.stateList.find(
    //         state => state.value === this.addressForm.get('state').value
    //       );
    //       if (selectedState) {
    //         this.loadStateData.emit(selectedState);
    //       }
    //     } else {
    //       if (!this.addressDetail) {
    //         this.addressForm.patchValue({
    //           city: ''
    //         });
    //         this.addressForm.get('city').disable();
    //       }
    //     }
    //   });
    // }

    this.filteredCityOptions$ = this.addressForm.controls[
      'city'
    ].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.description)),
      map(description =>
        description ? this._filterCity(description) : this.townList.slice()
      )
    );
  }

  autocompleteStringValidator(validOptions: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.stateList.length !== 0) {
        const validaState = this.stateList.find(
          val =>
            val?.description?.toUpperCase() === control?.value?.toUpperCase()
        );
        if (validaState) {
          return null; /* valid option selected */
        }
        return { invalidAutocompleteString: { value: control.value } };
      }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pincodeSummary'] && changes['pincodeSummary'].currentValue) {
      if (this.customerType !== 'INTERNATIONAL') {
        const stateInMaster = this.stateList.find(
          state => state.description === this.pincodeSummary.stateName
        );
        if (stateInMaster) {
          this.addressForm.controls['state'].patchValue(
            stateInMaster.description
          );
          this.addressForm.controls['city'].patchValue(
            this.pincodeSummary.townName
          );
          this.loadCatchmentAreas.emit(this.pincodeSummary.cachementArea);
        } else {
          this.addressForm.controls['state'].markAsTouched();
        }
      } else {
        this.addressForm.controls['state'].patchValue(
          this.pincodeSummary.stateName
        );
        this.addressForm.controls['city'].patchValue(
          this.pincodeSummary.townName
        );
      }
    }

    if (changes['countryList'] && changes['countryList'].currentValue) {
      this.countryListToDropdown = this.countryList.map(countu => ({
        value: countu.description,
        description: countu.description
      }));
      this.countryByCode = this.countryList.find(
        country => country.value === 'IND'
      );
      if (this.countryByCode && this.addressForm) {
        this.addressForm.controls['country'].patchValue(
          this.countryByCode.description
        );
        this.country = this.countryByCode.description;
        this.selectedCountryId(null, this.countryByCode.value);
        if (this.customerType !== CUSTOMER_TYPE_ENUM.INTERNATIONAL) {
          this.selectedCountryIdValue = this.countryCode;
        }
      }
    }
    if (
      changes['countryList'] &&
      this.addressDetail &&
      this.countryList.length !== 0
    ) {
      const selectedCountry = this.countryList.find(
        country => country.description === this.addressDetail.country
      );
      if (selectedCountry && selectedCountry !== undefined) {
        this.loadCountryId.emit(selectedCountry.value);
        this.selectedCountryIdValue = selectedCountry.value;
      }
    }

    if (
      changes['stateList'] &&
      this.addressDetail &&
      this.countryList.length !== 0 &&
      this.customerType !== 'INTERNATIONAL'
    ) {
      const slectedState = this.stateList.find(
        state => state.description === this.addressDetail.state
      );

      if (this.addressForm && slectedState && slectedState !== undefined) {
        this.addressForm.get('state').setValue(slectedState.description);
      }
    }
  }
  createAddressForm() {
    this.addressForm = this.formbuilder.group({
      country: [
        this.addressDetail &&
        this.addressDetail.country !== null &&
        this.addressDetail.country
          ? this.addressDetail.country
          : '',
        [
          this.fieldValidatorsService.requiredField(this.countryLabel),
          this.fieldValidatorsService.countryNameField(this.countryLabel)
        ]
        // [Validators.required]
      ],
      addressLine1: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[0]
          ? this.addressDetail.addressLines[0]
          : '',
        [
          this.fieldValidatorsService.requiredField(this.addressLine1Label),
          this.fieldValidatorsService.addressField(this.addressLine1Label)
        ]
        // [Validators.required, Validators.maxLength(40)]
      ],
      addressLine2: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[1]
          ? this.addressDetail.addressLines[1]
          : '',
        [
          this.fieldValidatorsService.requiredField(this.addressLine2Label),
          this.fieldValidatorsService.addressField(this.addressLine2Label)
        ]
        // [Validators.required, Validators.maxLength(40)]
      ],
      addressLine3: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[2]
          ? this.addressDetail.addressLines[2]
          : null,
        [this.fieldValidatorsService.addressField(this.addressLine3Label)]
      ],
      pincode: [
        this.addressDetail &&
        this.addressDetail.pinCode !== null &&
        this.addressDetail.pinCode
          ? this.addressDetail.pinCode
          : '',
        this.customerType !== CUSTOMER_TYPE_ENUM.INTERNATIONAL
          ? [
              this.fieldValidatorsService.requiredField(this.pincodeLabel),

              this.fieldValidatorsService.pincodeField(this.pincodeLabel)
            ]
          : [
              this.fieldValidatorsService.requiredField(this.pincodeLabel),
              this.fieldValidatorsService.zipcodeField(this.pincodeLabel)
            ]
        // [
        //   Validators.required,
        //   Validators.compose([Validators.pattern('^[0-9]{6}')])
        // ]
      ],
      city: [
        this.addressDetail &&
        this.addressDetail.city !== null &&
        this.addressDetail.city
          ? this.addressDetail.city
          : '',
        // [Validators.required]
        [
          this.fieldValidatorsService.requiredField(this.cityLabel),
          this.fieldValidatorsService.cityField(this.cityLabel)
        ]
      ],
      state: [
        this.addressDetail &&
        this.addressDetail.state !== null &&
        this.addressDetail.state
          ? this.addressDetail.state
          : '',
        // [Validators.required]
        this.customerType === 'INTERNATIONAL'
          ? [
              this.fieldValidatorsService.requiredField(this.stateLabel),
              this.fieldValidatorsService.stateField(this.stateLabel)
            ]
          : [
              this.fieldValidatorsService.requiredField(this.stateLabel),
              this.fieldValidatorsService.stateField(this.stateLabel),
              this.autocompleteStringValidator(this.stateList)
            ]
      ]
    });
    this.addressForm.get('state').disable();
    this.addressForm.get('city').disable();
    this.addressForm.get('pincode').disable();

    if (this.addressDetail) {
      this.addressForm.get('state').enable();
      this.addressForm.get('city').enable();
      this.addressForm.get('pincode').enable();
      this.country = this.addressDetail.country;
    }

    // if (this.data.countries.length === 1) {
    //   this.addressForm.patchValue({
    //     country: this.data.countries[0]
    //   });
    // }
  }

  private _filterCountry(description: string): CountrySummary[] {
    const filterValue = description.toLowerCase();
    return this.countryList.filter(option =>
      option.description.toLowerCase().includes(filterValue)
    );
  }

  updatedVal(e) {
    if (e && e.length >= 0) {
      this.showAutocomplete = true;
    } else {
      this.showAutocomplete = false;
    }
  }

  filerCountryById(id: any): any {
    const countryCode = id.toLowerCase();
    return this.countryList.filter(option =>
      option.value.toLowerCase().includes(countryCode)
    );
  }

  private _filterState(description: string): StateSummary[] {
    const filterValue = description.toLowerCase();
    return this.stateList.filter(
      option => option.description.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterCity(description: string): TownSummary[] {
    const filterValue = description.toLowerCase();
    return this.townList.filter(
      option => option.description.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onPincodeChange() {
    if (this.customerType !== CUSTOMER_TYPE_ENUM.INTERNATIONAL) {
      if (this.addressForm.get('pincode').invalid) {
        this.loadCatchmentAreas.emit(null);
      }
    }
  }

  selectedCountryId(event, countryId) {
    this.selectedCountryIdValue = countryId;
    if (
      this.selectedCountryIdValue !== null &&
      this.selectedCountryIdValue !== undefined &&
      this.selectedCountryIdValue !== ''
    ) {
      if (!this.addressDetail) {
        this.addressForm.get('state').enable();
        this.addressForm.get('pincode').enable();
        this.selectionChangeCountry();
      }
    } else {
      if (!this.addressDetail) {
        this.addressForm.patchValue({
          state: '',
          pincode: '',
          city: ''
        });
        this.addressForm.get('state').disable();
        this.addressForm.get('pincode').disable();
        this.addressForm.get('city').disable();
      }
    }
  }

  selectedStateId(event, stateId) {
    if (stateId) {
      this.loadStateId.emit(stateId);
      this.addressForm.patchValue({
        city: ''
      });
    }
  }

  selectionChangeCountry() {
    if (
      this.selectedCountryIdValue !== '' &&
      this.selectedCountryIdValue !== null &&
      this.selectedCountryIdValue !== undefined
    ) {
      this.loadCountryId.emit(this.selectedCountryIdValue);
      this.addressForm.patchValue({
        state: ''
      });
    }
  }

  selectedCountryDescription(contryValue) {
    if (this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL && contryValue) {
      const countrySelected = this.countryList.find(
        country =>
          country.description.toUpperCase() === contryValue.toUpperCase()
      );
      if (countrySelected) {
        this.loadCountryId.emit(countrySelected.value);
        this.addressForm.patchValue({
          state: ''
        });
      }
    }
  }

  selectionChangeState($event) {
    if ($event.value) {
      this.loadStateId.emit($event.value);
      this.addressForm.patchValue({
        city: ''
      });
    }
  }

  // displayDescriptionFn(option) {
  //   return option.description;
  // }

  // private _subscribeToClosingActions(): void {
  //   if (this.subscription && !this.subscription.closed) {
  //     this.subscription.unsubscribe();
  //   }

  //   this.subscription = this.trigger.panelClosingActions.subscribe(
  //     e => {
  //       if (!e || !e.source) {
  //         this.addressForm.controls['country'].patchValue('');
  //         this.selectedCountryIdValue = '';
  //         this.addressForm.get('state').disable();
  //         this.addressForm.get('city').disable();
  //         this.addressForm.get('pincode').disable();
  //       }
  //     },
  //     err => this._subscribeToClosingActions(),
  //     () => this._subscribeToClosingActions()
  //   );
  // }

  // ngAfterViewInit() {
  //   this._subscribeToClosingActions();
  // }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
