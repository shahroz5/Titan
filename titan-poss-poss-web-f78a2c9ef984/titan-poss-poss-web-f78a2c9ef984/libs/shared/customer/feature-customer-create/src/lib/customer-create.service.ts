import { takeUntil } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerCreateComponent } from './customer-create.component';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomerServiceAbstraction,
  CustomErrors,
  TownSummary,
  CustomerLov,
  Zone,
  CreatedCustomerResponse,
  CustomerInfo,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SEARCH_BY_ENUM,
  CUSTOMER_TYPE_ENUM,
  CustomerStateSummary
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';

@Injectable()
export class CustomerCreateService implements CustomerServiceAbstraction {
  initialCustomerConfig = {
    customerType: 'REGULAR',
    countries: [],
    states: [],
    towns: [],
    salutations: [],
    mobileNumber: '',
    emailIdValue: '',
    passportNumber: '',
    panNumber: '',
    ulpId: '',
    gstNumber: '',
    idProofs: [],
    pincodes: {
      townName: '',
      stateName: '',
      cachementArea: []
    },
    zone: [],
    customer: null,
    countryCode: '',
    countryList: [],
    catchmentList: [],
    isMobileNumberDisabled: false
  };

  constructor(
    private dialog: MatDialog,
    public translateService: TranslateService,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(serviceConfig): EventEmitter<any> {
    const destroy$ = new Subject();
    if (serviceConfig.customerId !== 'New') {
      this.customerFacade.loadSelectedCustomerDetail(
        serviceConfig.customerId,
        true
      );
    } else {
      if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
        serviceConfig.searchType === 'CUSTOMER_ORDER'
      ) {
        this.initialCustomerConfig.mobileNumber = serviceConfig.searchValue;
        this.initialCustomerConfig.gstNumber = '';
        this.initialCustomerConfig.panNumber = '';
        this.initialCustomerConfig.emailIdValue = '';
        this.initialCustomerConfig.passportNumber = '';
        this.initialCustomerConfig.isMobileNumberDisabled = true;
        this.initialCustomerConfig.ulpId = '';
      } else if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
        serviceConfig.searchType === SEARCH_BY_ENUM.ULP_ID
      ) {
        this.initialCustomerConfig.ulpId = serviceConfig.searchValue;
        this.initialCustomerConfig.gstNumber = '';
        this.initialCustomerConfig.panNumber = '';
        this.initialCustomerConfig.emailIdValue = '';
        this.initialCustomerConfig.passportNumber = '';
        this.initialCustomerConfig.mobileNumber = '';
      } else if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
        serviceConfig.searchType === SEARCH_BY_ENUM.MOBILE_NO
      ) {
        this.initialCustomerConfig.mobileNumber = serviceConfig.searchValue;
        this.initialCustomerConfig.gstNumber = '';
        this.initialCustomerConfig.panNumber = '';
        this.initialCustomerConfig.emailIdValue = '';
        this.initialCustomerConfig.passportNumber = '';
        this.initialCustomerConfig.ulpId = '';
      } else if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
        serviceConfig.searchType === SEARCH_BY_ENUM.GST_NO
      ) {
        this.initialCustomerConfig.gstNumber = serviceConfig.searchValue;
        this.initialCustomerConfig.mobileNumber = '';
        this.initialCustomerConfig.panNumber = '';
        this.initialCustomerConfig.emailIdValue = '';
        this.initialCustomerConfig.passportNumber = '';
        this.initialCustomerConfig.ulpId = '';
      } else if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
        serviceConfig.searchType === SEARCH_BY_ENUM.PAN_NO
      ) {
        this.initialCustomerConfig.panNumber = serviceConfig.searchValue;
        this.initialCustomerConfig.gstNumber = '';
        this.initialCustomerConfig.mobileNumber = '';
        this.initialCustomerConfig.emailIdValue = '';
        this.initialCustomerConfig.passportNumber = '';
        this.initialCustomerConfig.ulpId = '';
      } else if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
        serviceConfig.searchType === SEARCH_BY_ENUM.EMAIL_ID
      ) {
        this.initialCustomerConfig.emailIdValue = serviceConfig.searchValue;
        this.initialCustomerConfig.gstNumber = '';
        this.initialCustomerConfig.panNumber = '';
        this.initialCustomerConfig.mobileNumber = '';
        this.initialCustomerConfig.passportNumber = '';
        this.initialCustomerConfig.ulpId = '';
      } else if (
        serviceConfig.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
        serviceConfig.searchType === SEARCH_BY_ENUM.PASSPORT_ID
      ) {
        this.initialCustomerConfig.passportNumber = serviceConfig.searchValue;
        this.initialCustomerConfig.gstNumber = '';
        this.initialCustomerConfig.panNumber = '';
        this.initialCustomerConfig.emailIdValue = '';
        this.initialCustomerConfig.mobileNumber = '';
        this.initialCustomerConfig.ulpId = '';
      }
      this.initialCustomerConfig.customer = null;
    }

    this.customerFacade.loadCountries();
    this.customerFacade.loadCountryCode();
    this.customerFacade.loadSalutations('SALUTATION');
    this.customerFacade.loadIdProofs('ID_PROOF');
    this.customerFacade.loadZones();
    this.customerFacade.loadCatchmentArea();

    const customerConfig = this.initialCustomerConfig;
    customerConfig.customerType = serviceConfig.customerType;
    const dialogref = this.dialog.open(CustomerCreateComponent, {
      width: '1000px',
      autoFocus: false,
      disableClose: true,
      data: customerConfig
    });
    const componentInstance = dialogref.componentInstance;
    const event = new EventEmitter<any>();

    this.customerFacade
      .getError()
      .pipe(takeUntil(destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code !== 'ERR-INT-010') {
          this.errorHandler(error, destroy$);
        }
      });

    if (serviceConfig.customerId !== 'New') {
      this.customerFacade
        .getSelectedCustomerDetail()
        .pipe(takeUntil(destroy$))
        .subscribe((customerDetail: CreatedCustomerResponse) => {
          customerConfig.customer = customerDetail;
        });
    } else {
      customerConfig.customer = null;
    }

    this.customerFacade
      .getCountries()
      .pipe(takeUntil(destroy$))
      .subscribe((countries: any[]) => {
        countries = countries.map(countrys => ({
          value: '' + countrys.countryCode,
          description: countrys.description
        }));
        customerConfig.countries = countries.filter(country => {
          if (country.value === 'IND') {
            return {
              value: '' + country.countryCode,
              description: country.description
            };
          }
        });
        customerConfig.countryList = countries.filter(country => {
          if (country.value !== 'IND') {
            return {
              value: '' + country.countryCode,
              description: country.description
            };
          }
        });
      });

    this.customerFacade
      .getCountryCode()
      .pipe(takeUntil(destroy$))
      .subscribe((countryCode: string) => {
        customerConfig.countryCode = countryCode;
      });

    this.customerFacade
      .getSalutations()
      .pipe(takeUntil(destroy$))
      .subscribe((salutations: CustomerLov[]) => {
        customerConfig.salutations = salutations.map(salutation => ({
          value: '' + salutation.code,
          description: salutation.value
        }));
      });

    this.customerFacade
      .getCatchmentArea()
      .pipe(takeUntil(destroy$))
      .subscribe(catchmentArea => {
        customerConfig.catchmentList = catchmentArea;
      });

    this.customerFacade
      .getIdProofs()
      .pipe(takeUntil(destroy$))
      .subscribe((idProofs: CustomerLov[]) => {
        customerConfig.idProofs = idProofs.map(idProof => ({
          value: '' + idProof.value,
          description: idProof.value
        }));
      });

    this.customerFacade
      .getStates()
      .pipe(takeUntil(destroy$))
      .subscribe((states: CustomerStateSummary[]) => {
        customerConfig.states = states.map(country => ({
          value: '' + country.stateId,
          description: country.description,
          stateTaxCode: country.stateTaxCode
        }));
      });

    this.customerFacade
      .getTowns()
      .pipe(takeUntil(destroy$))
      .subscribe((towns: TownSummary[]) => {
        customerConfig.towns = towns.map(country => ({
          id: '' + country.townCode,
          description: country.description
        }));
      });

    this.customerFacade
      .getZones()
      .pipe(takeUntil(destroy$))
      .subscribe((zones: Zone[]) => {
        customerConfig.zone = zones.map(zone => ({
          value: '' + zone.description,
          description: zone.description
        }));
      });

    componentInstance.countryChange
      .pipe(takeUntil(destroy$))
      .subscribe((countryCode: string) => {
        this.customerFacade.loadStates(countryCode);
      });

    componentInstance.stateChange
      .pipe(takeUntil(destroy$))
      .subscribe((stateId: string) => {
        this.customerFacade.loadTowns(stateId);
      });

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: CustomerInfo) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  errorHandler(error: CustomErrors, destroy$: Subject<any>) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(destroy$))
      .subscribe();
  }
}
