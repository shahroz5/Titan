import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  PayeeBankDetails,
  OverlayNotificationServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  getbankDetailsRouteUrl,
  getConfigurationHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { PayeeBankFacade } from '@poss-web/shared/payee-bank/data-access-payee-bank';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
@Component({
  selector: 'poss-web-payee-bank-listing',
  templateUrl: './payee-bank-listing.component.html'
})
export class PayeeBankListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();
  permissions$: Observable<any[]>;
  ADD_EDIT_PAYEE_BANK_PERMISSIONS = 'Payee Bank - Add/Edit Payee Bank';
  payeeBankPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  pageSizeOptions: number[] = [];
  minPageSize: number;
  isLoading$: Observable<boolean>;
  payeeBankListing$: Observable<PayeeBankDetails[]>;
  payeeBankCount$: Observable<number>;
  hasError$: Observable<CustomErrors>;
  searchErrorCode: string;
  invalidSearch = false;
  searchData = '';
  payeeBankDetailsByBankName$: PayeeBankDetails;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  noDataFoundMessage: any;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private payeeBankFacade: PayeeBankFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.payeeBanksEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.payeeBanksEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.payeeBankFacade.resetBankDetails();
    this.payeeBankFacade.resetGlCodeDetails();
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.hasError$ = this.payeeBankFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_PAY_005;
    this.payeeBankFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.payeeBankPageEvent.pageSize = pageSize;
        this.loadPayeeBankDetails();
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.payeeBankFacade
      .getIsEditBankDetailsSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(editSuccess => {
        if (editSuccess) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications('pw.payeeBank.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
          this.loadPayeeBankDetails();
        }
      });
    this.isLoading$ = this.payeeBankFacade.getisLoading();
    this.payeeBankListing$ = this.payeeBankFacade.getPayeeBankDetailsListing();
    this.payeeBankCount$ = this.payeeBankFacade.getTotalPayeeBankDetails();

    this.payeeBankFacade
      .getPayeeBankSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadPayeeBankDetails();
        }
      });

    this.payeeBankFacade
      .getPayeeBankEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.loadPayeeBankDetails();
        }
      });
  }

  loadPayeeBankDetails() {
    this.payeeBankFacade.loadPayeeBankDetailsListing({
      description: this.searchData,
      pageIndex: this.payeeBankPageEvent.pageIndex,
      pageSize: this.payeeBankPageEvent.pageSize
    });
  }
  addnew() {
    this.router.navigate([getbankDetailsRouteUrl('new')]);
  }
  getpayeeBankName(bankName: string) {
    this.router.navigate([getbankDetailsRouteUrl(bankName)]);
  }

  onChangeToggle(event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.searchForm.reset();
          this.payeeBankFacade.editPayeeBankFormDetails({
            bankName: event.bankName,
            bankCode: event.bankCode,
            address: event.addressOne + ' addr2 ' + event.addressTwo,
            mailId: event.mailId,
            contactPerson: event.contactPerson,
            ownerType: event.ownerType,
            isActive: event.isActive
          });
        } else this.loadPayeeBankDetails();
      });
  }
  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.searchData = searchValue;
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }
  search() {
    if (fieldValidation.bankNameField.pattern.test(this.searchData)) {
      this.invalidSearch = false;
      this.payeeBankPageEvent.pageIndex = 0;
      this.loadPayeeBankDetails();
    } else {
      this.invalidSearch = true;
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.searchData = '';
    this.payeeBankPageEvent.pageIndex = 0;
    this.loadPayeeBankDetails();
  }

  paginate(pageEvent: PageEvent) {
    this.payeeBankPageEvent = pageEvent;
    this.loadPayeeBankDetails();
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }
  openViewPage(bankName) {
    this.router.navigate([getbankDetailsRouteUrl(bankName)], {
      queryParams: { showViewOnly: 'true' },
      queryParamsHandling: 'merge'
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
