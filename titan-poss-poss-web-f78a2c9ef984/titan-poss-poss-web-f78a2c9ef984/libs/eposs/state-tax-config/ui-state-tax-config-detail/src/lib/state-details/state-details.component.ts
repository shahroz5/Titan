import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  StateData,
  StateTaxConfigurationStateDetails,
  TaxsList,
  CessData,
  TaxComponentData,
  TaxDataConfig,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder
} from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-state-details',
  templateUrl: './state-details.component.html',
  styleUrls: ['./state-details.component.scss']
})
export class StateDetailsComponent implements OnInit, OnDestroy {
  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService
  ) {}

  @Input() allStateList: StateData[];
  allStateListSelect: { value: string; description: string }[];
  @Input() allTaxSystemList: string[];
  allTaxSystemListSelect: { value: string; description: string }[];
  @Input() stateTaxConfigurationStateDetails: Observable<
    StateTaxConfigurationStateDetails
  >;
  @Input() allTaxsList: Observable<TaxsList[]>;

  @Output() stateTaxConfigurationStateFormDetails = new EventEmitter<
    StateTaxConfigurationStateDetails
  >();

  cessData: CessData[] = [];
  taxsListData: TaxsList[];

  destroy$ = new Subject<null>();
  stateDetailsForm: FormGroup;
  stateDetails: StateTaxConfigurationStateDetails;

  ngOnInit() {
    this.allStateListSelect = this.getAllStateList(this.allStateList);
    this.allTaxSystemListSelect = this.getAllTaxSystemList(
      this.allTaxSystemList
    );
    this.stateTaxConfigurationStateDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((details: StateTaxConfigurationStateDetails) => {
        if (details) {
          this.stateDetails = details;
        }
      });

    combineLatest([this.stateTaxConfigurationStateDetails, this.allTaxsList])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.taxsListData = result[1];
        if (result[0] && result[1]) {
          this.cessData = [];
          const cessComponent = result[0].taxComponent.cess;
          result[1]
            .filter(d => d.taxSystem === 'CESS')
            .forEach(cess => {
              const filterData = cessComponent.filter(
                data => data.cessCode === cess.taxCode
              );
              if (filterData.length) {
                this.cessData.push({ ...filterData[0], selected: true });
              } else {
                this.cessData.push({
                  cessCode: cess.taxCode,
                  cessOnTax: false,
                  selected: false
                });
              }
            });
        } else if (result[1]) {
          this.cessData = [];
          result[1]
            .filter(d => d.taxSystem === 'CESS')
            .forEach(cess => {
              this.cessData.push({
                cessCode: cess.taxCode,
                cessOnTax: false,
                selected: false
              });
            });
        }

        if (result[0]) {
          this.initForm(result[0]);
        } else {
          this.initForm(null);
        }
      });

    // for (let i = 0; i < this.cessDetails.length; i++) {
    // }

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['params']['_configId']) {
          this.stateDetailsForm.get('stateList').disable({ onlySelf: true });
        }
      });
  }

  onSubmit() {
    console.log('details', this.stateTaxConfigurationStateDetails);
    if (
      this.stateDetails &&
      this.stateDetails?.stateCode !== '' &&
      !this.stateDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const formValues = this.stateDetailsForm.getRawValue();

      const stateName = this.allStateList.filter(
        stateData => stateData.stateId === formValues.stateList
      )[0].description;

      const tax: TaxDataConfig[] = [];
      const cess: CessData[] = [];

      this.taxsListData
        .filter(flt => flt.taxSystem === formValues.taxSystemList)
        .forEach(list => {
          tax.push({
            taxCode: list.taxCode
          });
        });

      for (let i = 0; i < this.cessData.length; i++) {
        if (formValues.CESS_Details[i].cessValues) {
          cess.push({
            cessCode: this.cessData[i].cessCode,
            cessOnTax: formValues.CESS_Details[i].cessOnTax
          });
        }
      }

      const taxComponent: TaxComponentData = {
        taxSystem: formValues.taxSystemList,
        tax,
        cess
      };

      const saveFormData: StateTaxConfigurationStateDetails = {
        stateId: formValues.stateList,
        stateCode: formValues.stateCode,
        stateName: stateName,
        stateTaxCode: formValues.gstStateCode,
        isActive: formValues.isActive,
        taxComponent
      };
      this.stateTaxConfigurationStateFormDetails.emit(saveFormData);
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  get cessItemDetails() {
    return this.stateDetailsForm.get('CESS_Details') as FormArray;
  }

  initForm(
    stateTaxConfigurationStateDetails: StateTaxConfigurationStateDetails
  ) {
    this.stateDetailsForm = new FormGroup({
      isActive: new FormControl(
        stateTaxConfigurationStateDetails
          ? stateTaxConfigurationStateDetails.isActive
          : true,
        Validators.required
      ),
      stateList: new FormControl(
        stateTaxConfigurationStateDetails
          ? stateTaxConfigurationStateDetails.stateId
          : null,
        this.fieldValidatorsService.requiredField('State List')
      ),
      stateCode: new FormControl(
        stateTaxConfigurationStateDetails
          ? stateTaxConfigurationStateDetails.stateCode
          : null,
        this.fieldValidatorsService.requiredField('State Code')
      ),
      gstStateCode: new FormControl(
        stateTaxConfigurationStateDetails
          ? stateTaxConfigurationStateDetails.stateTaxCode
          : null,
        this.fieldValidatorsService.requiredField('GST State Code')
      ),
      taxSystemList: new FormControl(
        stateTaxConfigurationStateDetails
          ? stateTaxConfigurationStateDetails.taxComponent.taxSystem
          : null,
        this.fieldValidatorsService.requiredField('tax System List')
      ),
      CESS_Details: this.fb.array([])
    });

    this.cessData.forEach(element => {
      this.cessItemDetails.push(
        this.fb.group({
          cessValues: new FormControl(element.selected),
          cessOnTax: new FormControl(element.cessOnTax)
        })
      );
    });

    this.stateDetailsForm.get('stateList').valueChanges.subscribe(stateId => {
      const stateData = this.allStateList.filter(
        list => list.stateId === stateId
      )[0];
      if (stateData) {
        this.stateDetailsForm.get('stateCode').patchValue(stateData.stateCode);
        this.stateDetailsForm
          .get('gstStateCode')
          .patchValue(stateData.stateTaxCode);
      }
    });

    this.cdr.detectChanges();
  }

  getAllStateList(data: StateData[]) {
    return data.map(val => {
      return {
        value: val.stateId.toString(),
        description: val.description
      };
    });
  }

  getAllTaxSystemList(data: string[]) {
    return data.map(val => {
      return {
        value: val,
        description: val
      };
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export class CessForm {
  name: string;
  isSelected: boolean;

  constructor(name: string, isSelected: boolean) {
    this.name = name;
    this.isSelected = isSelected;
  }
}
