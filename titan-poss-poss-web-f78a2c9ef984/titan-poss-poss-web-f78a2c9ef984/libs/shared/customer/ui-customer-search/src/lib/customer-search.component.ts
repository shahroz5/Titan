import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  CustomerInfo,
  SEARCH_BY_ENUM,
  CUSTOMER_MEMBER_TYPE,
  SearchByOption,
  CUSTOMER_TYPE_ENUM,
  SelectDropDownOption,
  CashMemoDetailsResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ShortcutServiceAbstraction,
  Command,
  PaymentDetails,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { CustomerUlpIdSearchComponent } from './customer-ulp-id-search/customer-ulp-id-search.component';
import { CustomerPassportNoSearchComponent } from './customer-passport-no-search/customer-passport-no-search.component';
import { CustomerPanNoSearchComponent } from './customer-pan-no-search/customer-pan-no-search.component';
import { CustomerMobileNoSearchComponent } from './customer-mobile-no-search/customer-mobile-no-search.component';
import { CustomerEmailIdSearchComponent } from './customer-email-id-search/customer-email-id-search.component';
import { CustomerGstNoSearchComponent } from './customer-gst-no-search/customer-gst-no-search.component';
import { CustomerNameSearchComponent } from './customer-name-search/customer-name-search/customer-name-search.component';
import { MatDialog } from '@angular/material/dialog';
import { UlpIdPopupComponent } from './ulp-id-popup/ulp-id-popup.component';
import { ConnectionService } from 'ng-connection-service';

const searchTypeShortcutKey = 'CustomerSearchComponent.PRIMARY_DROPDOWN';
const customerSearchShortcutKey = 'CustomerSearchComponent.SECONDARY_SEARCH';
const editCustomerShortcutKey = 'CustomerSearchComponent.EDIT';
const viewCustomerShortcutKey = 'CustomerSearchComponent.VIEW';
const clearCustomerShortcutKey = 'CustomerSearchComponent.CLOSE';

@Component({
  selector: 'poss-web-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isSearching: boolean;
  @Input() hasResult$: Observable<boolean>;
  @Input() result: Observable<CustomerInfo>;
  @Input() oneTimeCustomer: Observable<CustomerInfo[]>;
  @Input() selectedCustomer: Observable<CustomerInfo>;
  @Input() enableCustomerDelete: boolean;
  @Input() enableClear = false;
  @Input() enableEdit = false;
  @Input() enableCreate = false;
  @Input() issuePendingFoc = false;
  @Input() mobileNumberStartSeries: any;

  @Input() allowedCustomerTypes: CUSTOMER_TYPE_ENUM[] = [];

  @Input() partailUpdateCashMemoDetails: CashMemoDetailsResponse;
  @Input() viewCashMemoDetails: CashMemoDetailsResponse;
  @Input() ghsPaymentsAdded;
  @Input() isBillLevelDiscountSelected = false;
  @Input() numberOfProductsInGrid = 0;
  @Input() tcsToBeCollectedAtCM: number;
  @Input() paymentDetails: PaymentDetails[] = [];
  @Input() transactionType;
  @Input() hideCustomerSearch = false;
  @Output() search = new EventEmitter<{
    searchBy: string;
    searchValue: string;
  }>();
  @Output() clear = new EventEmitter();
  @Output() selected = new EventEmitter<CustomerInfo>();
  @Output() selectedInternationalCustomer = new EventEmitter<string>();
  @Output() selectedOneTimeCustomer = new EventEmitter<string>();
  @Output() resetTcsAmount = new EventEmitter();

  @Output() create = new EventEmitter<{
    customerType: CUSTOMER_TYPE_ENUM;
    searchType: string;
    searchValue: string;
  }>();
  @Output() edit = new EventEmitter<{
    customerType: string;
    customerId: string;
  }>();
  @Output() view = new EventEmitter<any>();
  @Output() deleteError = new EventEmitter<any>();

  searchForm: FormGroup;
  customer: CustomerInfo = null;
  customersInfo: CustomerInfo[] = [];
  isCustomerSelected = false;
  destroy$: Subject<null> = new Subject<null>();
  showValidationError = false;
  customerMemberType: string;
  customerMemebrTypeColor: string;

  allSearchByOptions: SearchByOption[] = [];
  searchByOptions: SearchByOption[] = [];
  dropdownSearchOptions: SelectDropDownOption[] = [];
  selectedSearchByOption: SearchByOption;
  searchByEnumRef = SEARCH_BY_ENUM;
  appliedDiscountType = null;
  hasResult = null;
  @ViewChild(SelectDropdownComponent, { static: true })
  selectDropdownRef: SelectDropdownComponent;
  @ViewChild(CustomerUlpIdSearchComponent)
  customerUlpIdSearchComponentRef: CustomerUlpIdSearchComponent;
  @ViewChild(CustomerPassportNoSearchComponent)
  customerPassportNoSearchComponentRef: CustomerPassportNoSearchComponent;
  @ViewChild(CustomerPanNoSearchComponent)
  customerPanNoSearchComponentRef: CustomerPanNoSearchComponent;
  @ViewChild(CustomerMobileNoSearchComponent)
  customerMobileNoSearchComponentRef: CustomerMobileNoSearchComponent;
  @ViewChild(CustomerEmailIdSearchComponent)
  customerEmailIdSearchComponentRef: CustomerEmailIdSearchComponent;
  @ViewChild(CustomerGstNoSearchComponent)
  customerGstNoSearchComponentRef: CustomerGstNoSearchComponent;
  @ViewChild(CustomerNameSearchComponent)
  CustomerNameSearchComponentRef: CustomerNameSearchComponent;
  tranlateMsg: any;
  status = 'ONLINE';

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction,
    private dialog: MatDialog,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      if (isConnected?.hasNetworkConnection) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });

    this.translate
      .get([
        'pw.customerSearch.mobileNoOption',
        'pw.customerSearch.ulpIdOption',
        'pw.customerSearch.panNoOption',
        'pw.customerSearch.gstNoOption',
        'pw.customerSearch.passportIdOption',
        'pw.customerSearch.emailIdOption',
        'pw.customerSearch.customerNameOption'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.tranlateMsg = translatedMessages;
        this.allSearchByOptions = [
          {
            description: translatedMessages['pw.customerSearch.mobileNoOption'],
            value: SEARCH_BY_ENUM.MOBILE_NO,
            placeholder: 'pw.customerSearch.mobileNoPlaceholder',
            validator: this.fieldValidatorsService.mobileField(
              translatedMessages['pw.customerSearch.mobileNoOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.REGULAR,
            createCustomerLabel: 'pw.customerSearch.createRegularCustomerLabel'
          },
          {
            description: translatedMessages['pw.customerSearch.ulpIdOption'],
            value: SEARCH_BY_ENUM.ULP_ID,
            placeholder: 'pw.customerSearch.ulpIdPlaceholder',
            validator: this.fieldValidatorsService.ulpIdField(
              translatedMessages['pw.customerSearch.ulpIdOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.REGULAR,
            createCustomerLabel: 'pw.customerSearch.createRegularCustomerLabel'
          },
          {
            description: translatedMessages['pw.customerSearch.panNoOption'],
            value: SEARCH_BY_ENUM.PAN_NO,
            placeholder: 'pw.customerSearch.panNoPlaceholder',
            validator: this.fieldValidatorsService.pancardField(
              translatedMessages['pw.customerSearch.panNoOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.INSTITUTIONAL,
            createCustomerLabel:
              'pw.customerSearch.createInstitutionalCustomerLabel'
          },
          {
            description: translatedMessages['pw.customerSearch.gstNoOption'],
            value: SEARCH_BY_ENUM.GST_NO,
            placeholder: 'pw.customerSearch.gstNoPlaceholder',
            validator: this.fieldValidatorsService.gstNumberField(
              translatedMessages['pw.customerSearch.gstNoOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.INSTITUTIONAL,
            createCustomerLabel:
              'pw.customerSearch.createInstitutionalCustomerLabel'
          },
          {
            description:
              translatedMessages['pw.customerSearch.passportIdOption'],
            value: SEARCH_BY_ENUM.PASSPORT_ID,
            placeholder: 'pw.customerSearch.passportIdPlaceholder',
            validator: this.fieldValidatorsService.passportIdField(
              translatedMessages['pw.customerSearch.passportIdOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.INTERNATIONAL,
            createCustomerLabel:
              'pw.customerSearch.createInternationalCustomerLabel'
          },
          {
            description: translatedMessages['pw.customerSearch.emailIdOption'],
            value: SEARCH_BY_ENUM.EMAIL_ID,
            placeholder: 'pw.customerSearch.emailIdPlaceholder',
            validator: this.fieldValidatorsService.emailField(
              translatedMessages['pw.customerSearch.emailIdOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.INTERNATIONAL,
            createCustomerLabel:
              'pw.customerSearch.createInternationalCustomerLabel'
          },
          {
            description:
              translatedMessages['pw.customerSearch.customerNameOption'],
            value: SEARCH_BY_ENUM.CUSTOMER_NAME,
            placeholder: 'pw.customerSearch.customerNamePlaceholder',
            validator: this.fieldValidatorsService.customerNameField(
              translatedMessages['pw.customerSearch.customerNameOption']
            ),
            customerType: CUSTOMER_TYPE_ENUM.ONE_TIME,
            createCustomerLabel: 'pw.customerSearch.createOneTimeCustomerLabel'
          }
        ];

        this.createOptions();
      });
  }

  ngOnInit() {
    this.selectedCustomer
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: CustomerInfo) => {
        if (!customer && this.searchForm) {
          this.createForm();
        }
        this.showValidationError = false;
        this.isCustomerSelected = !!customer;
        this.customer = customer;
      });

    this.result
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: CustomerInfo) => {
        if (customer) {
          this.readCustomerData(customer);
        }
      });

    this.hasResult$.pipe(takeUntil(this.destroy$)).subscribe(hasResult => {
      this.hasResult = hasResult;
      if (
        hasResult === false &&
        (this.selectedSearchByOption.value === SEARCH_BY_ENUM.ULP_ID ||
          this.selectedSearchByOption.value === SEARCH_BY_ENUM.MOBILE_NO)
      ) {
        if (
          !this.isCustomerSelected &&
          hasResult === false &&
          this.status === 'OFFLINE'
        ) {
          const dialog = this.dialog.open(UlpIdPopupComponent, {
            width: '450px',
            data: null,
            disableClose: true
          });
          dialog.afterClosed().subscribe(res => {
            if (res) {
              this.createCustomer(
                CUSTOMER_TYPE_ENUM.REGULAR,
                SEARCH_BY_ENUM.ULP_ID,
                res
              );
            }
          });
        }
      }
    });

    this.oneTimeCustomer
      .pipe(takeUntil(this.destroy$))
      .subscribe((customerInfo: CustomerInfo[]) => {
        customerInfo.forEach(customer => {
          this.readCustomerData(customer);
        });
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allowedCustomerTypes']) {
      this.createOptions();
    }
    if (changes['ghsPaymentsAdded']) {
      this.ghsPaymentsAdded = this.ghsPaymentsAdded;
    }

    if (changes['mobileNumberStartSeries']) {
      this.mobileNumberStartSeries =
        changes['mobileNumberStartSeries'].currentValue;
      if (this.mobileNumberStartSeries) {
        this.allSearchByOptions[0].validator = this.fieldValidatorsService.mobileSeriesCheck(
          this.tranlateMsg['pw.customerSearch.mobileNoOption'],
          this.mobileNumberStartSeries
        );
      }
    }
  }

  createOptions() {
    this.searchByOptions = this.allSearchByOptions.filter(option =>
      this.checkCustomerType(option.customerType)
    );
    this.dropdownSearchOptions = this.searchByOptions.map(option => ({
      value: option.value,
      description: option.description
    }));
    this.createForm();
  }

  createForm() {
    if (this.searchByOptions.length) {
      this.searchForm = new FormGroup({
        searchValue: new FormControl(null, [this.searchByOptions[0].validator]),
        searchBy: new FormControl(this.dropdownSearchOptions[0].value)
      });
      this.selectedSearchByOption = this.searchByOptions[0];
    } else {
      this.searchForm = new FormGroup({
        searchValue: new FormControl(null),
        searchBy: new FormControl(null)
      });
      this.selectedSearchByOption = null;
    }

    this.searchForm
      .get('searchBy')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.clearResult(true);
        this.selectedSearchByOption = this.searchByOptions.find(option => {
          return option.value === this.searchForm.get('searchBy').value;
        });
        if (this.selectedSearchByOption) {
          this.searchForm
            .get('searchValue')
            .setValidators(this.selectedSearchByOption.validator);
        }
      });
  }

  searchFn() {
    this.customersInfo = [];
    if (this.checkCustomerSearch() && !this.isCustomerSelected) {
      const searchBy = this.searchForm.get('searchBy').value;
      let searchValue = (this.searchForm.get('searchValue')
        .value as string).trim();

      if (searchValue !== '') {
        if (this.searchForm.get('searchValue').valid) {
          this.showValidationError = false;

          if (searchBy === SEARCH_BY_ENUM.EMAIL_ID) {
            searchValue = searchValue.toLowerCase();
          } else {
            searchValue = searchValue.toUpperCase();
          }
          this.search.emit({
            searchBy: searchBy,
            searchValue
          });
        } else {
          this.showValidationError = true;
        }
      } else {
        this.clearResult(true);
      }
    }
  }

  checkCustomerType(customerType: CUSTOMER_TYPE_ENUM): boolean {
    return this.allowedCustomerTypes.includes(customerType);
  }

  checkCustomerSearch(): boolean {
    return (
      this.checkCustomerType(CUSTOMER_TYPE_ENUM.REGULAR) ||
      this.checkCustomerType(CUSTOMER_TYPE_ENUM.INTERNATIONAL) ||
      this.checkCustomerType(CUSTOMER_TYPE_ENUM.INSTITUTIONAL) ||
      this.checkCustomerType(CUSTOMER_TYPE_ENUM.ONE_TIME)
    );
  }

  isRegularCustomer(customer: CustomerInfo): boolean {
    return customer?.customerType === CUSTOMER_TYPE_ENUM.REGULAR;
  }

  isInstitutionalCustomer(customer: CustomerInfo): boolean {
    return customer?.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL;
  }

  isInternationalCustomer(customer: CustomerInfo): boolean {
    return customer?.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL;
  }

  isOnetimeCustomer(customer: CustomerInfo): boolean {
    return customer?.customerDetails?.type === CUSTOMER_TYPE_ENUM.ONE_TIME;
  }

  readCustomerData(customer: CustomerInfo) {
    this.customer = customer;
    this.customersInfo.push(customer);
    if (customer && customer.currentTier) {
      // TODO : Class to be created in global scc
      switch (customer.currentTier.toUpperCase()) {
        case CUSTOMER_MEMBER_TYPE.GOLD: {
          this.customerMemberType = CUSTOMER_MEMBER_TYPE.GOLD.charAt(0);
          this.customerMemebrTypeColor = 'pw-member-type-gold';
          break;
        }
        case CUSTOMER_MEMBER_TYPE.SILVER: {
          this.customerMemberType = CUSTOMER_MEMBER_TYPE.SILVER.charAt(0);
          this.customerMemebrTypeColor = 'pw-member-type-gold';
          break;
        }
        case CUSTOMER_MEMBER_TYPE.PLATINUM: {
          this.customerMemberType = CUSTOMER_MEMBER_TYPE.PLATINUM.charAt(0);
          this.customerMemebrTypeColor = 'pw-member-type-gold';
          break;
        }
      }
    } else {
      this.customerMemberType = null;
      this.customerMemebrTypeColor = null;
    }
  }

  focus() {}

  selectCustomer(customer: CustomerInfo) {
    if (this.isCustomerDependantDiscountApplied()) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.INFO,
          message:
            'Please remove the applied Customer Dependant Discount (' +
            this.appliedDiscountType +
            ') to change the customer'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    } else {
      if (this.searchForm.get('searchBy').value === SEARCH_BY_ENUM.EMAIL_ID) {
        this.selectedInternationalCustomer.emit(customer.passportId);
      } else if (
        this.searchForm.get('searchBy').value === SEARCH_BY_ENUM.CUSTOMER_NAME
      ) {
        this.selectedOneTimeCustomer.emit(customer.customerId);
      } else {
        this.selected.emit(customer);
      }
    }
  }

  clearResult(skipDeleteCheck: boolean): void {
    if (
      !skipDeleteCheck &&
      this.isCustomerSelected &&
      !this.enableCustomerDelete
    ) {
      this.deleteError.emit();
    } else {
      const tcsPayment = this.paymentDetails.find(
        value => value.isTcsPayment === true
      );
      if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        tcsPayment
      ) {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.INFO,
          message: 'pw.payment.deleteTcsPaymentLabel'
        });
      } else if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        !tcsPayment
      ) {
        this.resetTcsAmount.emit();
      } else if (this.isCustomerDependantDiscountApplied()) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message:
              'Please remove the applied Customer Dependant Discount (' +
              this.appliedDiscountType +
              ' Discount) to change the customer'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      } else if (this.ghsPaymentsAdded.length !== 0) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: 'Customer cannot be changed once GHS payment is added'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      } else if (this.isBillLevelDiscountSelected) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: 'pw.customerSearch.billLevelDiscErrorMsg'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      } else {
        this.clear.emit();
        if (this.searchForm) {
          this.searchForm.get('searchValue').reset();
        }
        this.isCustomerSelected = false;
        this.customer = null;
        this.customersInfo = [];
        this.customerMemberType = null;
        this.customerMemebrTypeColor = null;
        this.showValidationError = false;
      }
    }
  }

  clearError(event) {
    if (event.code !== 'Enter' && event.code !== 'Space') {
      this.showValidationError = false;
      this.customer = null;
      this.customersInfo = [];
      this.hasResult = null;
    }
  }

  spaceCheck($event: KeyboardEvent) {
    return $event.key !== ' ';
  }

  createCustomer(
    customerType: CUSTOMER_TYPE_ENUM,
    searchType: string,
    searchValue: string
  ) {
    this.create.next({ customerType, searchType, searchValue });
  }

  viewCustomer() {
    this.view.next(this.customer);
  }

  editCustomer(customerType, customerId) {
    this.edit.next({ customerType, customerId });
  }
  isCustomerDependantDiscountApplied(): boolean {
    if (this.partailUpdateCashMemoDetails) {
      if (
        this.partailUpdateCashMemoDetails?.discountDetails &&
        this.partailUpdateCashMemoDetails?.discountDetails?.data
      ) {
        const discountData = this.partailUpdateCashMemoDetails?.discountDetails
          ?.data;
        if (discountData?.employeeDetails) {
          this.appliedDiscountType = 'Employee';
          return true;
        } else if (
          discountData?.encircleDetails &&
          discountData?.encircleDetails?.discountType &&
          this.numberOfProductsInGrid !== 0
        ) {
          this.appliedDiscountType = 'Encircle';
          return true;
        } else if (discountData?.tataEmployeeDetails) {
          this.appliedDiscountType = 'TATA Employee';
          return true;
        } else if (discountData?.tsssDetails) {
          this.appliedDiscountType = 'TSSS';
          return true;
        } else if (
          discountData?.ghsDiscountDetails?.voucherDetails.length > 0
        ) {
          this.appliedDiscountType = 'GH Discount Voucher';
          return true;
        } else if (discountData?.empowermentDetails?.applyEmpowermentDiscount) {
          this.appliedDiscountType = 'Empowerment';
          return true;
        }
      }
    } else if (this.viewCashMemoDetails) {
      if (
        this.viewCashMemoDetails?.discountDetails &&
        this.viewCashMemoDetails?.discountDetails?.data
      ) {
        const discountData = this.viewCashMemoDetails?.discountDetails?.data;
        if (discountData?.employeeDetails) {
          this.appliedDiscountType = 'Employee';
          return true;
        } else if (
          discountData?.encircleDetails &&
          discountData?.encircleDetails?.discountType &&
          this.numberOfProductsInGrid !== 0
        ) {
          this.appliedDiscountType = 'Encircle';
          return true;
        } else if (discountData?.tataEmployeeDetails) {
          this.appliedDiscountType = 'TATA Employee';
          return true;
        } else if (discountData?.tsssDetails) {
          this.appliedDiscountType = 'TSSS';
          return true;
        } else if (
          discountData?.ghsDiscountDetails?.voucherDetails.length > 0
        ) {
          this.appliedDiscountType = 'Discount Voucher';
          return true;
        } else if (discountData?.empowermentDetails?.applyEmpowermentDiscount) {
          this.appliedDiscountType = 'Empowerment';
          return true;
        }
      }
    }
    this.appliedDiscountType = null;
    return false;
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchTypeShortcutKey: {
        if (this.selectDropdownRef) this.selectDropdownRef.focus();
        break;
      }
      case customerSearchShortcutKey: {
        if (this.selectedSearchByOption?.value === SEARCH_BY_ENUM.MOBILE_NO)
          this.customerMobileNoSearchComponentRef.focus();
        else if (this.selectedSearchByOption?.value === SEARCH_BY_ENUM.EMAIL_ID)
          this.customerEmailIdSearchComponentRef.focus();
        else if (this.selectedSearchByOption?.value === SEARCH_BY_ENUM.PAN_NO)
          this.customerPanNoSearchComponentRef.focus();
        else if (
          this.selectedSearchByOption?.value === SEARCH_BY_ENUM.PASSPORT_ID
        )
          this.customerPassportNoSearchComponentRef.focus();
        else if (this.selectedSearchByOption?.value === SEARCH_BY_ENUM.ULP_ID)
          this.customerUlpIdSearchComponentRef.focus();
        else if (this.selectedSearchByOption?.value === SEARCH_BY_ENUM.GST_NO)
          this.customerGstNoSearchComponentRef.focus();
        else if (
          this.selectedSearchByOption?.value === SEARCH_BY_ENUM.CUSTOMER_NAME
        )
          this.CustomerNameSearchComponentRef.focus();
        break;
      }
      case editCustomerShortcutKey: {
        if (
          this.enableEdit &&
          (this.isInstitutionalCustomer(this.customer) ||
            this.isInternationalCustomer(this.customer) ||
            this.isRegularCustomer(this.customer) ||
            this.isOnetimeCustomer(this.customer))
        ) {
          this.editCustomer('', this.customer.customerId);
        }
        break;
      }
      case viewCustomerShortcutKey: {
        if (this.customer) this.viewCustomer();
        break;
      }
      case clearCustomerShortcutKey: {
        if (this.enableClear) this.clearResult(false);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
