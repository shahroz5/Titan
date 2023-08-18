import { Subject } from 'rxjs';
import {
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  SelectedLocationFilters,
  LocationFilterConfig,
  LocationFilterOption,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { POSS_WEB_MAX_FILTER_OPTION_SELECTION } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss']
})
export class LocationFilterComponent implements OnInit, OnDestroy {
  locationFilterForm: FormGroup;
  // Only multi select form controll name
  formControlNames = ['brands', 'regions', 'levels', 'towns'];
  destroy$ = new Subject();

  @Input() config: LocationFilterConfig;
  @Input() hasDefaultBrand = true;
  @Input() hasDefaultCountry = true;
  @Input() buttonText: string;
  @Input() readonly = false;
  @Output() clear = new EventEmitter<null>();
  @Output() filter = new EventEmitter<SelectedLocationFilters>();
  @Output() loadStates = new EventEmitter<{
    countryCode: string;
    regionCodes: string[];
  }>();
  @Output() loadTowns = new EventEmitter<string>();

  countryMap = new Map<
    string,
    { value: string; description: string; towns?: LocationFilterOption[] }[]
  >();
  stateMap = new Map<string, LocationFilterOption[]>();
  allStates: any[] = [];
  allTowns: any[] = [];
  setStatesFromInput = false;
  setTownFromInput = false;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(POSS_WEB_MAX_FILTER_OPTION_SELECTION)
    public maxFilterOptionsSelection
  ) {}

  setDefaultBrand(brand: LocationFilterOption) {
    if (this.locationFilterForm && this.setDefaultBrand) {
      this.locationFilterForm.get('brands').setValue([brand?.id]);
    }
  }

  setDefaultCountry(country: SelectDropDownOption) {
    if (this.locationFilterForm && this.hasDefaultCountry) {
      this.locationFilterForm.get('countries').setValue(country.value);
    }
  }

  ngOnInit(): void {
    if (this.config?.setInputs?.setCountriesFromInput) {
      this.fetchCountryData();
    }

    const selectedLocationFilters: SelectedLocationFilters = this.config
      .selectedLocationFilters;
    this.locationFilterForm = this.formBuilder.group({
      brands: [selectedLocationFilters.brands],
      regions: [selectedLocationFilters.regions],
      levels: [selectedLocationFilters.levels],
      countries: [],
      states: [],
      towns: []
    });
    this.locationFilterForm.setValidators(this.minFilterSelectionValidator());

    this.locationFilterForm.get('states').disable();
    this.locationFilterForm.get('towns').disable();

    this.locationFilterForm
      .get('regions')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        this.fetchStates();
        this.locationFilterForm.get('towns').disable();
        this.locationFilterForm.get('states').reset();
        this.locationFilterForm.get('towns').reset();
      });

    this.locationFilterForm
      .get('countries')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(country => {
        if (country !== null && country !== undefined) {
          this.fetchStates();
          this.locationFilterForm.get('states').enable();
          this.locationFilterForm.get('towns').enable();
        } else {
          this.locationFilterForm.get('states').disable();
          this.locationFilterForm.get('towns').disable();
          if (this.config?.setInputs?.setCountriesFromInput) {
            this.setAllStates();
            this.setAllTowns();
          }
        }
        this.locationFilterForm.get('states').reset();
        this.locationFilterForm.get('towns').reset();
      });

    this.locationFilterForm
      .get('states')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state !== null && state !== undefined) {
          this.fetchTowns(state);
          this.locationFilterForm.get('towns').enable();
        } else {
          this.locationFilterForm.get('towns').disable();
          if (this.config?.setInputs?.setStatesFromInput) {
            this.setAllCountryTowns();
          }
        }
        this.locationFilterForm.get('towns').reset();
      });

    if (selectedLocationFilters.countries.length) {
      this.locationFilterForm
        .get('countries')
        .setValue(selectedLocationFilters.countries[0]);
      if (selectedLocationFilters.states.length) {
        this.locationFilterForm
          .get('states')
          .setValue(selectedLocationFilters.states[0]);
        if (selectedLocationFilters.towns.length) {
          this.locationFilterForm
            .get('towns')
            .setValue(selectedLocationFilters.towns);
        }
      }
    }
    if (
      this.config?.setInputs?.setBrandFromInput &&
      this.config?.filterOptions?.brands?.length
    ) {
      this.locationFilterForm
        .get('brands')
        .setValue([this.config.filterOptions.brands[0].id]);
    }

    if (this.readonly) {
      this.locationFilterForm.disable();
    }
  }

  minFilterSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let count = 0;
      if (
        control.get('countries').value !== null &&
        control.get('countries').value !== undefined
      ) {
        count = count + 1;
      }
      if (
        control.get('states').value !== null &&
        control.get('states').value !== undefined
      ) {
        count = count + 1;
      }
      for (let i = 0; i < this.formControlNames.length; i++) {
        if (
          control.get(this.formControlNames[i]).value &&
          control.get(this.formControlNames[i]).value.length > 0
        ) {
          count = count + 1;
        }
      }
      return this.config && count < this.config.minFilterSelection
        ? {
            minSelection: this.config.minFilterSelection
          }
        : null;
    };
  }

  getLableWithSelectedOptionsCount(
    formControlName: string,
    placeholder: string
  ): string {
    if (
      this.locationFilterForm &&
      this.locationFilterForm.get(formControlName) &&
      this.locationFilterForm.get(formControlName).value &&
      this.locationFilterForm.get(formControlName).value.length
    ) {
      return (
        placeholder +
        ' (' +
        this.locationFilterForm.get(formControlName).value.length +
        ')'
      );
    } else {
      return placeholder;
    }
  }

  clearFilter() {
    this.locationFilterForm.reset();
    this.clear.emit();
    if (this.config?.setInputs?.setCountriesFromInput) {
      this.setAllStates();
      this.setAllTowns();
    }
  }

  searchLocations() {
    this.locationFilterForm.markAsDirty();
    if (this.locationFilterForm.valid) {
      const locationFilterFormValue = this.locationFilterForm.value;
      const response = {
        brands: locationFilterFormValue['brands']
          ? locationFilterFormValue['brands']
          : [],
        regions: locationFilterFormValue['regions']
          ? locationFilterFormValue['regions']
          : [],
        levels: locationFilterFormValue['levels']
          ? locationFilterFormValue['levels']
          : [],
        countries: locationFilterFormValue['countries']
          ? [locationFilterFormValue['countries']]
          : [],
        states: locationFilterFormValue['states']
          ? [locationFilterFormValue['states']]
          : [],
        towns: locationFilterFormValue['towns']
          ? locationFilterFormValue['towns']
          : []
      };

      if (
        this.config?.setInputs?.setLevelsFromInput &&
        response?.levels?.length === 0
      ) {
        response.levels = this.config.filterOptions.levels.map(data => data.id);
      }

      if (
        this.config?.setInputs?.setBrandFromInput &&
        response?.brands?.length === 0
      ) {
        response.brands = this.config.filterOptions.brands.map(data => data.id);
      }

      if (
        this.config?.setInputs?.setRegionFromInput &&
        response?.regions?.length === 0
      ) {
        response.regions = this.config.filterOptions.regions.map(
          data => data.id
        );
      }

      if (
        this.config?.setInputs?.setCountriesFromInput &&
        response?.countries?.length === 0
      ) {
        response.countries = this.config.filterOptions.countries.map(
          data => data.value
        );
      }

      if (
        this.config?.setInputs?.setStatesFromInput &&
        response?.states?.length === 0
      ) {
        response.states = this.config.filterOptions.states.map(
          data => data.value
        );
      }

      if (
        this.config?.setInputs?.setTownsFromInput &&
        response?.towns?.length === 0
      ) {
        response.towns = this.config.filterOptions.towns.map(data => data.id);
      }
      this.filter.emit(response);
    }
  }

  fetchCountryData() {
    this.config.filterOptions.countries = this.config.setInputs.countryData.map(
      country => {
        if (country?.states?.length) {
          this.countryMap.set(country.value, country.states);

          country.states.forEach(state => {
            this.allStates.push({
              value: state.value,
              description: state.description
            });

            this.setStatesFromInput = true;

            if (state?.towns?.length) {
              this.stateMap.set(state.value, state.towns);
              this.allTowns = this.allTowns.concat(state.towns);
              this.setTownFromInput = true;
            }
          });
        }
        return { value: country.value, description: country.decription };
      }
    );
    this.setAllStates();
    this.setAllTowns();
  }

  fetchStates() {
    const countryCode = this.locationFilterForm.get('countries').value;
    if (
      this.config?.setInputs?.setCountriesFromInput &&
      this.countryMap.has(countryCode)
    ) {
      this.config.filterOptions.states = this.countryMap
        .get(countryCode)
        .map(state => ({
          value: state.value,
          description: state.description
        }));
      this.config.setInputs.setStatesFromInput = true;

      this.setAllCountryTowns();
    } else {
      this.config.setInputs.setStatesFromInput = false;
      const regionCodes = this.locationFilterForm.get('regions').value;
      if (countryCode) {
        this.loadStates.emit({ countryCode, regionCodes });
      }
    }
  }

  fetchTowns(stateCode: string) {
    if (
      this.config?.setInputs?.setStatesFromInput &&
      this.stateMap.has(stateCode)
    ) {
      this.config.filterOptions.towns = this.stateMap.get(stateCode);
      this.config.setInputs.setTownsFromInput = true;
    } else {
      this.config.setInputs.setTownsFromInput = false;
      this.loadTowns.emit(stateCode);
    }
  }

  setAllStates() {
    this.config.filterOptions.states = this.allStates;
    this.config.setInputs.setStatesFromInput = this.setStatesFromInput;
  }

  setAllTowns() {
    this.config.filterOptions.towns = this.allTowns;
    this.config.setInputs.setTownsFromInput = this.setTownFromInput;
  }

  setAllCountryTowns() {
    const counryCode = this.locationFilterForm.get('countries').value;
    let towns = [];
    if (this.countryMap.has(counryCode)) {
      this.countryMap.get(counryCode).forEach(state => {
        if (this.stateMap.has(state.value)) {
          towns = towns.concat(this.stateMap.get(state.value));
        }
      });
      this.config.setInputs.setTownsFromInput = towns.length !== 0;
      this.config.filterOptions.towns = towns;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
