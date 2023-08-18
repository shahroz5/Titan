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
  ElementRef
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
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
  AddressDetail
} from '@poss-web/shared/models';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'poss-web-encircle-address-panel',
  templateUrl: './encircle-address-panel.component.html'
})
export class EncircleAddressPanelComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() submitted$: Subject<boolean>;
  @Input() getStateData$: Subject<boolean>;
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
  @Input() isAdvancebookingType: boolean;

  @ViewChild(MatAutocompleteTrigger)
  trigger: MatAutocompleteTrigger;

  destroy$ = new Subject();

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
  houseNumberLabel: string;
  streetOrRoadLabel: string;
  buildingNameLabel: string;
  colonyOrLocalityLabel: string;
  pincodeLabel: string;
  cityLabel: string;
  stateLabel: string;
  countryListToDropdown: any;
  @ViewChild('auto') matAutocomplete: ElementRef<HTMLInputElement>;
  showAutocomplete: boolean;
  @ViewChild('firstname') nameInput: MatInput;

  constructor(
    public translate: TranslateService,
    private formbuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.addressPanel.countryLabel',
        'pw.addressPanel.houseNumberLabel',
        'pw.addressPanel.streetOrRoadLabel',
        'pw.addressPanel.buildingNameLabel',
        'pw.addressPanel.colonyOrLocalityLabel',
        'pw.addressPanel.pincodeLabel',
        'pw.addressPanel.cityLabel',
        'pw.addressPanel.stateLabel'
      ])
      .subscribe((translatedLabels: any) => {
        this.countryLabel = translatedLabels['pw.addressPanel.countryLabel'];
        this.houseNumberLabel =
          translatedLabels['pw.addressPanel.houseNumberLabel'];
        this.streetOrRoadLabel =
          translatedLabels['pw.addressPanel.streetOrRoadLabel'];
        this.buildingNameLabel =
          translatedLabels['pw.addressPanel.buildingNameLabel'];
        this.colonyOrLocalityLabel =
          translatedLabels['pw.addressPanel.colonyOrLocalityLabel'];
        this.pincodeLabel = translatedLabels['pw.addressPanel.pincodeLabel'];
        this.cityLabel = translatedLabels['pw.addressPanel.cityLabel'];
        this.stateLabel = translatedLabels['pw.addressPanel.stateLabel'];
      });
  }

  ngOnInit() {
    this.createAddressForm();
    this.submitted$.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if (val) {
        if (this.addressForm.valid) {
          const addressFormValues = this.addressForm.getRawValue();
          const selectedState = this.stateList.find(state =>
            state.value !== null
              ? state.value.toUpperCase() ===
                this.addressForm.get('state').value.toUpperCase()
              : null
          );
          if (selectedState) {
            addressFormValues.state = selectedState.description;
          }

          this.loadAddressForm.emit(addressFormValues);
        } else if (this.isAdvancebookingType) {
          const addressFormValues = this.addressForm.getRawValue();
          console.log(addressFormValues);
          this.loadAddressForm.emit(addressFormValues);
        } else {
          Object.keys(this.addressForm.controls).forEach(control => {
            if (this.addressForm.get(control).enabled) {
              this.addressForm.get(control).markAsTouched();
            }
          });
          this.nameInput.focus();
        }
      } else {
        this.createAddressForm();
        this.selectedCountryIdValue = 'IND';
        this.allValueChanges();
      }
    });

    this.getStateData$.pipe(takeUntil(this.destroy$)).subscribe(bool => {
      if (bool && this.addressForm.get('state').value) {
        const selectedState = this.stateList.find(state =>
          state.value !== null
            ? state.value.toUpperCase() ===
              this.addressForm.get('state').value.toUpperCase()
            : null
        );
        if (selectedState) {
          this.loadStateData.emit(selectedState);
        }
      }
    });

    this.allValueChanges();
    if (this.addressDetail) {
      this.addressForm.markAllAsTouched();
    }
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
          this.loadPincodes.emit({
            countryCode: this.selectedCountryIdValue,
            pincode: this.addressForm.get('pincode').value
          });
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

    // this.addressForm.controls['state'].valueChanges.subscribe(states => {
    //   if (states !== null && states !== undefined && states !== '') {
    //     if (this.isAdvancebookingType) {
    //       this.addressForm.get('city').disable();
    //     } else {
    //       this.addressForm.get('city').enable();
    //     }

    //     const selectedState = this.stateList.find(
    //       state => state.value === this.addressForm.get('state').value
    //     );
    //     if (selectedState) {
    //       this.loadStateData.emit(selectedState);
    //     }
    //   } else {
    //     if (!this.addressDetail) {
    //       this.addressForm.patchValue({
    //         city: ''
    //       });
    //       this.addressForm.get('city').disable();
    //     }
    //   }
    // });
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
          if (this.isAdvancebookingType) {
            this.addressForm.get('city').disable();
          } else {
            this.addressForm.get('city').enable();
          }

          const selectedState = this.stateList.find(state =>
            state.value !== null
              ? state.value.toUpperCase() ===
                this.addressForm.get('state').value.toUpperCase()
              : null
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
        const validaState = this.stateList.find(val =>
          val.description !== null
            ? val.description.toUpperCase() === control.value.toUpperCase()
            : null
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
      const stateInMaster = this.stateList.find(state =>
        state.description !== null
          ? state.description.toUpperCase() ===
            this.pincodeSummary.stateName.toUpperCase()
          : null
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

        this.selectedCountryIdValue = 'IND';
      }
    }

    if (
      changes['countryList'] &&
      this.addressDetail &&
      this.countryList.length !== 0
    ) {
      const selectedCountry = this.countryList.find(country =>
        country.description !== null
          ? country.description.toUpperCase() ===
            this.addressDetail.country.toUpperCase()
          : null
      );
      if (selectedCountry && selectedCountry !== undefined) {
        this.loadCountryId.emit(selectedCountry.value);
        this.selectedCountryIdValue = selectedCountry.value;
      } else {
        this.selectedCountryIdValue = 'IND';
        this.loadCountryId.emit(this.selectedCountryIdValue);
      }
    }

    if (
      changes['stateList'] &&
      this.addressDetail &&
      this.stateList.length > 0
    ) {
      const slectedState = this.stateList.find(state =>
        state.description !== null
          ? state.description.toUpperCase() ===
            this.addressDetail.state.toUpperCase()
          : null
      );

      if (slectedState && this.addressForm && slectedState !== undefined) {
        this.addressForm.get('state').setValue(slectedState.description);
      }
    }
  }
  createAddressForm() {
    this.addressForm = this.formbuilder.group({
      country: [
        this.country
          ? this.addressDetail &&
            this.addressDetail.country !== null &&
            this.addressDetail.country
            ? this.addressDetail.country
            : this.country
          : '',
        [
          this.fieldValidatorsService.requiredField(this.countryLabel),
          this.fieldValidatorsService.countryNameField(this.countryLabel)
        ]
      ],
      houseNumber: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[0]
          ? this.addressDetail.addressLines[0]
          : '',
        [
          this.fieldValidatorsService.requiredField(this.houseNumberLabel),
          this.fieldValidatorsService.addressField(this.houseNumberLabel)
        ]
      ],
      street: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[1]
          ? this.addressDetail.addressLines[1]
          : '',
        [
          this.fieldValidatorsService.requiredField(this.streetOrRoadLabel),
          this.fieldValidatorsService.addressField(this.streetOrRoadLabel)
        ]
      ],
      buildingName: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[2]
          ? this.addressDetail.addressLines[2]
          : '',
        [this.fieldValidatorsService.addressField(this.buildingNameLabel)]
      ],
      colony: [
        this.addressDetail &&
        this.addressDetail.addressLines !== null &&
        this.addressDetail.addressLines[3]
          ? this.addressDetail.addressLines[3]
          : '',
        [this.fieldValidatorsService.addressField(this.colonyOrLocalityLabel)]
      ],
      pincode: [
        this.addressDetail &&
        this.addressDetail.pinCode !== null &&
        this.addressDetail.pinCode
          ? this.addressDetail.pinCode
          : '',
        [
          this.fieldValidatorsService.requiredField(this.pincodeLabel),
          this.fieldValidatorsService.pincodeField(this.pincodeLabel)
        ]
      ],
      city: [
        this.addressDetail &&
        this.addressDetail.city !== null &&
        this.addressDetail.city
          ? this.addressDetail.city
          : '',
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

        [
          this.fieldValidatorsService.requiredField(this.stateLabel),
          this.fieldValidatorsService.stateField(this.stateLabel),
          this.autocompleteStringValidator(this.stateList)
        ]
      ]
    });
    // this.addressForm.get('state').disable();
    this.addressForm.get('city').disable();
    // this.addressForm.get('pincode').disable();

    if (this.addressDetail) {
      this.country = this.addressDetail.country;
      this.addressForm.get('country').setValue(this.country);
      if (this.isAdvancebookingType) {
        this.addressForm.get('state').disable();
        this.addressForm.get('city').disable();
        this.addressForm.get('pincode').disable();
        this.addressForm.get('country').disable();
        this.addressForm.get('houseNumber').disable();
        this.addressForm.get('buildingName').disable();
        this.addressForm.get('colony').disable();
        this.addressForm.get('street').disable();
      } else {
        this.addressForm.get('state').enable();
        this.addressForm.get('city').enable();
        this.addressForm.get('pincode').enable();
      }
    }
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

  getCountryDescription() {
    if (this.addressDetail.country) {
      const countryObject = {
        id: 'USA',
        description: 'USA'
      };
      return countryObject;
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
    if (this.addressForm.get('pincode').invalid) {
      this.loadCatchmentAreas.emit(null);
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

  selectionChangeState($event) {
    if ($event.value) {
      this.loadStateId.emit($event.value);
      this.addressForm.patchValue({
        city: ''
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
