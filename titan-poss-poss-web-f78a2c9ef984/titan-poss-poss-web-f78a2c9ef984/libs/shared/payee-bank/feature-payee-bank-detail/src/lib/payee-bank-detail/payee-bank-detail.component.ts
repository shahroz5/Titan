import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, fromEvent, combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PayeeBankFacade } from '@poss-web/shared/payee-bank/data-access-payee-bank';
import { FormGroup, FormControl } from '@angular/forms';
import {
  getPayeeBankRouteUrl,
  getPayeeDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  PayeeBankDetails,
  SavePayeeBankFormPayload,
  SelectedLocationFilters,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  SaveGLcodeDetails,
  LocationMappingServiceResponse,
  GlSelectMappedLocations,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  PaymentModeEnum,
  StateSummary,
  TownSummary,
  OverlayNotificationEventType,
  CustomErrors
} from '@poss-web/shared/models';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { TownDataService } from '@poss-web/shared/masters/data-access-masters';

@Component({
  selector: 'poss-web-payee-bank-detail',
  templateUrl: './payee-bank-detail.component.html',
  styleUrls: ['./payee-bank-detail.component.scss']
})
export class PayeeBankDetailComponent
  implements OnInit, AfterViewInit, OnDestroy {
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  count = 0;
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  totalElements$: Observable<number>;

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  bankDetails$: Observable<PayeeBankDetails>;
  bankDetails: PayeeBankDetails;
  glCodeData;
  unmappedGlCodeData;

  tab: string;
  bankName: string;
  paymentModeEnumRef = PaymentModeEnum;
  formData: FormGroup;
  searchFormControl = new FormControl();
  @ViewChild('locationCodeSearch')
  locationCodeSearch: ElementRef;
  radioVal;
  saveGlCodeData: SaveGLcodeDetails;
  selectedLocationFilters: SelectedLocationFilters = {
    brands: [],
    regions: [],
    levels: [],
    countries: [],
    states: [],
    towns: []
  };
  locationCodedata;
  searchValue: string;
  isfilterApplied = false;
  glCodeDefaults: any;
  public defaultGlCodes: any;
  update: any;
  mappedLocations: GlSelectMappedLocations[];
  selectedLocations;
  newItems: any;
  subTab: any;
  popupMessage = '';
  onFormSubmit: FormGroup;
  locationsAdded: any[];
  locationsRemoved = [];
  paymentCodes;
  locations;
  dialogRef: any;
  duplicateDataErrorCode: any;
  removePaymentCodes: any[];
  disableCheck: boolean;
  updateArray: any;
  mode: string;
  popupDuplicateMsg = '';
  showViewOnly: boolean;
  country: string;
  states$: Observable<StateSummary[]>;
  towns$: Observable<TownSummary[]>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private payeeBankFacade: PayeeBankFacade,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private profileDataFacade: ProfileDataFacade,
    private appSettingFacade: AppsettingFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.bankName = this.route.snapshot.params['_bankName'];
    this.translate
      .get([
        'pw.payeeBank.popupErrorMessage',
        'pw.payeeBank.popupDuplicateErrorMsg'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.popupMessage =
          translatedMessages['pw.payeeBank.popupErrorMessage'];
        this.popupDuplicateMsg =
          translatedMessages['pw.payeeBank.popupDuplicateErrorMsg'];
      });
  }

  ngOnInit() {
    this.payeeBankFacade.resetGlCodeDetails();
    this.payeeBankFacade.resetBankDetails();
    this.route.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.onFormSubmit = new FormGroup({
      glCode: new FormControl(
        { value: '', disabled: this.showViewOnly ? true : false },
        [
          (this.fieldValidatorsService.fitGlCodeField('GL Code'),
          this.fieldValidatorsService.requiredField('GL Code'))
        ]
      ),
      isDefault: new FormControl(false),
      locations: new FormControl({ value: '', disabled: true })
    });

    this.tab = this.route.snapshot.params['type'];
    this.bankName = this.route.snapshot.params['_bankName'];
    this.payeeBankFacade.loadPayeeBankDetailsByPayeeBankName(this.bankName);
    this.payeeBankFacade.loadLocations();
    this.isLoading$ = this.payeeBankFacade.getisLoading();
    this.bankDetails$ = this.payeeBankFacade.getPayeeBankDetailsByPayeeBankName();
    this.totalElements$ = this.payeeBankFacade.getGlCodeListCount();
    this.states$ = this.payeeBankFacade.getStates();
    this.towns$ = this.payeeBankFacade.getTowns();
    combineLatest([
      this.payeeBankFacade.getGlCodeDetails().pipe(takeUntil(this.destroy$)),
      this.payeeBankFacade.getLocationCodes().pipe(takeUntil(this.destroy$))
    ]).subscribe(([glCodeDetails, locationDetails]) => {
      if (glCodeDetails && locationDetails) {
        this.glCodeData = [];
        for (let i = 0; i < glCodeDetails.length; i++) {
          this.glCodeData.push({
            ...glCodeDetails[i],
            ...locationDetails.find(
              itmInner =>
                itmInner.locationCode === glCodeDetails[i].locationCode
            )
          });
        }
      }
      console.log(glCodeDetails, 'glCodeDetails FEATURA');
      console.log(this.glCodeData, 'GLCODEDATA FEATURA');
    });
    this.profileDataFacade
      .getUserCountryName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => {
        console.log(code, 'code');
        this.country = code;
        this.payeeBankFacade.loadStates(code);
      });
    this.payeeBankFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.payeeBankFacade
      .getIsSaveBankDetailsSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saveSuccess => {
        if (saveSuccess) {
          if (!this.showViewOnly)
            this.showNotifications('pw.payeeBank.successMsg');
        }
      });
    this.payeeBankFacade
      .getIsEditBankDetailsSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(editSuccess => {
        if (editSuccess) {
          if (!this.showViewOnly)
            this.showNotifications('pw.payeeBank.editSuccessMsg');
        }
      });
    this.payeeBankFacade
      .getSaveGlCodeSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(editGlCodeSuccess => {
        if (editGlCodeSuccess) {
          this.loadGlCodeDetails();
          this.loadMappedLocations();
          if (!this.showViewOnly)
            this.showGlNotifications('pw.payeeBank.editGlCodeSusscessMsg');
        }
      });

    this.payeeBankFacade
      .getGlCodeDefaults()
      .pipe(takeUntil(this.destroy$))
      .subscribe(defaultsData => {
        if (defaultsData.length !== 0) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: this.popupMessage
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.updateArray = [];
                this.defaultGlCodes.forEach(item => {
                  if (item.bankName !== this.bankName) {
                    this.updateArray.push({
                      glCode: item.glCode,
                      id: item.id,
                      isDefault: false
                    });
                  }
                });
                if (this.update.length) {
                  this.update.forEach(data => {
                    this.updateArray.push(data);
                  });
                }
                console.log(this.updateArray, 'updatearray');

                this.saveGlCodeDetails(
                  this.locations,
                  this.paymentCodes,
                  this.updateArray,
                  this.removePaymentCodes
                );
              } else {
                if (this.mode === 'edit') {
                  this.defaultGlCodes.forEach(obj => {
                    this.update.splice(
                      this.update.findIndex(i => {
                        return i.id === obj.id;
                      }),
                      1
                    );
                  });
                  if (this.update.length) {
                    this.saveGlCodeDetails(
                      this.locations,
                      this.paymentCodes,
                      this.update,
                      this.removePaymentCodes
                    );
                  }
                } else if (this.mode === 'add') {
                  this.defaultGlCodes.forEach(defData => {
                    const index = this.locations.indexOf(defData.locationCode);
                    if (index > -1) {
                      this.locations.splice(index, 1);
                    }
                  });
                  if (this.locations.length)
                    this.saveGlCodeDetails(
                      this.locations,
                      this.paymentCodes,
                      [],
                      this.removePaymentCodes
                    );
                }
              }
            });
          this.defaultGlCodes = defaultsData;
        } else if (this.tab === 'glCodeDetails' && defaultsData.length === 0) {
          this.saveGlCodeDetails(
            this.locations,
            this.paymentCodes,
            this.update,
            this.removePaymentCodes
          );
        }
      });

    this.payeeBankFacade
      .getGlCodeMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(mappedLocations => {
        if (mappedLocations) {
          console.log(mappedLocations, 'mappedLocations');

          this.mappedLocations = mappedLocations;
        }
      });
    this.bankDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankDetails: PayeeBankDetails) => {
        if (bankDetails) {
          this.bankDetails = bankDetails;
          let selctedstate;
          this.states$
          .pipe(takeUntil(this.destroy$))
          .subscribe((statesArr => {
            if(statesArr) {
              console.log(statesArr,'arr')
              selctedstate = statesArr.filter(x => x.description === this.bankDetails.stateName);
            }
            if(selctedstate?.length > 0){
              this.payeeBankFacade.loadTowns(selctedstate[0].stateId);
            }
          }));

        }
      });
  }



  loadGlCodeDetails() {
    this.payeeBankFacade.loadGlCodeDetails({
      payloadData: {
        bankName: this.bankName,
        paymentCode:
          this.subTab === PaymentModeEnum.CHEQUE
            ? [this.subTab, PaymentModeEnum.DD]
            : [this.subTab]
      },
      pageEvent: this.listingPageEvent
    });
  }
  changeTab(changeType: string) {
    this.tab = changeType;

    if (this.onFormSubmit.get('glCode').value !== '') {
      this.disableCheck = false;
    } else this.disableCheck = true;
    this.onFormSubmit.get('glCode').valueChanges.subscribe(val => {
      if (val !== '') this.disableCheck = false;
      else this.disableCheck = true;
    });
    if (this.showViewOnly) {
      this.router.navigate([getPayeeDetailsRouteUrl(this.bankName, this.tab)], {
        queryParams: { showViewOnly: 'true' },
        queryParamsHandling: 'merge'
      });
    } else
      this.router.navigate([getPayeeDetailsRouteUrl(this.bankName, this.tab)]);
    if (this.tab === 'glCodeDetails') {
      this.subTab = PaymentModeEnum.CASH;
      this.loadGlDetails();
      this.loadMappedLocations();
    }
  }
  loadMappedLocations() {
    this.payeeBankFacade.loadGlCodeMappedLocations({
      payloadData: {
        bankName: this.bankName,
        paymentCode: [this.subTab]
      }
    });
  }
  loadGlDetails() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.listingPageEvent.pageSize = pageSize;
        this.loadGlCodeDetails();
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.count = data;
        }
      });
  }
  changeSubTab(subTab) {
    this.subTab = subTab;
    this.unmappedGlCodeData = [];
    this.clearSearch();
    this.onFormSubmit.reset();
    this.locationsAdded = [];
    this.loadGlCodeDetails();
    this.loadMappedLocations();
  }
  backArrow() {
    this.router.navigate([getPayeeBankRouteUrl()]);
  }
  addDetails(formDetails: SavePayeeBankFormPayload) {
    this.bankName = this.route.snapshot.params['_bankName'];
    if (this.bankName === 'new') {
      formDetails.isActive = true;
      this.payeeBankFacade.savePayeeBankFormDetails(formDetails);
    } else {
      formDetails.bankName = this.bankName;
      console.log(formDetails, 'formDetails');

      this.payeeBankFacade.editPayeeBankFormDetails(formDetails);
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

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.router.navigate([getPayeeBankRouteUrl()]);
            this.overlayNotification.close();
          });
      });
  }
  showGlNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }
  deleteRow(data) {
    const codedata = [];
    this.payeeBankFacade.deleteGlRowData(data.id);
    this.removePaymentCodes = [];
    this.removePaymentCodes.push(this.subTab);
    if (this.subTab === PaymentModeEnum.CHEQUE)
      this.removePaymentCodes.push(PaymentModeEnum.DD);

    this.payeeBankFacade.saveGlCodeDetails({
      bankName: this.bankName,
      addLocations: [data.rowKey],
      addPaymentCodes: [],
      removeLocations: [],
      removePaymentCodes: this.removePaymentCodes,
      updateConfigs: []
    });
  }

  openLocationFilter() {
    this.locationMappingService
      .openFilter({
        selectedLocationFilters: this.selectedLocationFilters
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.checkFilter(res);
          if (res.type === 'apply' && res.locations.length) {
            this.selectedLocationFilters = res.selectedLocationFilters;
            this.payeeBankFacade.loadGlCodeDetails({
              payloadData: {
                bankName: this.bankName,
                paymentCode: [this.subTab],
                locationCode: res.locations.map(l => l.id)
              },
              pageEvent: this.listingPageEvent
            });
          } else {
            this.selectedLocationFilters = res.selectedLocationFilters;
            this.glCodeData = [];
          }
        }
      });
  }
  checkFilter(res) {
    if (
      !res.selectedLocationFilters.brands.length &&
      !res.selectedLocationFilters.regions.length &&
      !res.selectedLocationFilters.levels.length &&
      !res.selectedLocationFilters.countries.length &&
      !res.selectedLocationFilters.states.length &&
      !res.selectedLocationFilters.towns.length
    ) {
      this.isfilterApplied = false;
    } else this.isfilterApplied = true;
  }
  addLocations() {
    if (!this.bankDetails.isActive && this.bankDetails.bankCode !== '') {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      this.locationMappingService
        .open({
          selectedLocations: this.mappedLocations
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: LocationMappingServiceResponse) => {
          if (res.type === 'apply') {
            console.log(res.data, 'checkk');
            this.locationsRemoved = [];
            this.locationsRemoved = res.data.removedLocations.map(l => l.id);
            this.locationsAdded = [];
            this.locationsAdded = res.data.addedLocations.map(l => l.id);
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

            if (this.locationsRemoved.length) {
              this.payeeBankFacade.saveGlCodeDetails({
                bankName: this.bankName,
                addLocations: [],
                addPaymentCodes: [],
                removePaymentCodes: [],
                removeLocations: this.locationsRemoved,
                updateConfigs: []
              });
              this.loadMappedLocations();
            }
          }
        });
    }
  }

  saveDetails() {
    if (!this.bankDetails.isActive && this.bankDetails.bankCode !== '') {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      this.mode = 'add';
      this.glCodeDefaults = [];
      this.paymentCodes = [];
      this.locations = [];
      this.removePaymentCodes = [];

      const values = this.onFormSubmit.getRawValue();
      this.locations = this.locationsAdded;

      this.paymentCodes.push({
        glCode: values.glCode,
        isDefault: values.isDefault ? values.isDefault : false,
        paymentCode: this.subTab
      });
      if (this.subTab === PaymentModeEnum.CHEQUE)
        this.paymentCodes.push({
          glCode: values.glCode,
          isDefault: values.isDefault ? values.isDefault : false,
          paymentCode: PaymentModeEnum.DD
        });
      this.locations.forEach(loc => {
        this.paymentCodes.forEach(code => {
          this.glCodeDefaults.push({
            locationCode: loc,
            paymentCode: code.paymentCode
          });
        });
      });
      const defaults = {};
      defaults['defaultList'] = this.glCodeDefaults;
      if (values.isDefault) {
        this.update = [];
        this.payeeBankFacade.loadGlCodeDefaults(defaults);
      } else
        this.saveGlCodeDetails(
          this.locations,
          this.paymentCodes,
          [],
          this.removePaymentCodes
        );

      this.onFormSubmit.reset();
      this.locationsAdded = [];
    }
  }

  saveGlCodeDetails(locations, addPaymentCodes, update, removePaymentCodes) {
    this.payeeBankFacade.saveGlCodeDetails({
      bankName: this.bankName,
      addLocations: locations,
      addPaymentCodes: addPaymentCodes,
      removePaymentCodes: removePaymentCodes,
      removeLocations: [],
      updateConfigs: update
    });
  }
  editGlCodeDetails(data) {
    this.mode = 'edit';
    if (data.addPaymentCodes[0].isDefault) {
      this.glCodeDefaults = [];
      this.locations = [];
      this.paymentCodes = [];
      this.removePaymentCodes = [];
      this.update = data.updateConfigs;
      data.addLocations.forEach(loc => {
        this.glCodeDefaults.push({
          locationCode: loc,
          paymentCode: this.subTab
        });
      });
      const defaults = {};
      defaults['defaultList'] = this.glCodeDefaults;
      this.payeeBankFacade.loadGlCodeDefaults(defaults);
    } else {
      this.locations = [];
      this.paymentCodes = [];
      this.removePaymentCodes = [];
      this.update = data.updateConfigs;
      this.saveGlCodeDetails(
        this.locations,
        this.paymentCodes,
        this.update,
        this.removePaymentCodes
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.locationCodeSearch) {
      fromEvent(this.locationCodeSearch.nativeElement, 'input')
        .pipe(debounceTime(1000), takeUntil(this.destroy$))
        .subscribe((event: any) => {
          this.searchValue = this.searchFormControl.value;
          if (this.searchValue) {
            this.payeeBankFacade.loadGlCodeDetails({
              payloadData: {
                bankName: this.bankName,
                paymentCode:
                  this.subTab === PaymentModeEnum.CHEQUE
                    ? [this.subTab, PaymentModeEnum.DD]
                    : [this.subTab],
                locationCode: [this.searchValue.toUpperCase()]
              },
              pageEvent: this.listingPageEvent
            });
          } else {
            this.clearSearch();
          }
        });
    }
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
    // }
  }
  formGroup(formGroup: FormGroup) {
    formGroup
      .get('1-state')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(stateIdSF => {
        console.log(stateIdSF, 'stateIdSF');

        if (stateIdSF) {
          formGroup.get('1-city')['options'] = [];
          this.payeeBankFacade.loadTowns(stateIdSF);
        }
      });
  }
  clearSearch() {
    this.searchFormControl.reset();
    this.loadGlCodeDetails();
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadGlCodeDetails();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
