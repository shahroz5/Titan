import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { takeUntil, take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import {
  CustomErrors,
  TransactionTypeMasterDetails,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { TransactionTypeMasterFacade } from '@poss-web/shared/transaction-type-master/data-access-transaction-type-master';

import { TransactionTypeMasterDetailsComponent } from '@poss-web/shared/transaction-type-master/ui-transaction-type-master-detail';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-transaction-type-master-listing',
  templateUrl: './transaction-type-master-listing.component.html',
  styleUrls: ['./transaction-type-master-listing.component.scss']
})
export class TransactionTypeMasterListingComponent
  implements OnInit, OnDestroy {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();

  transactionTypeMasterPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  isLoading$: Observable<boolean>;
  transactionTypeMasterListing$: Observable<TransactionTypeMasterDetails[]>;
  transactionTypeMasterCount$: Observable<number>;

  hasError$: Observable<CustomErrors>;

  searchErrorCode: string;
  invalidSearch = false;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private transactionTypeMasterFacade: TransactionTypeMasterFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.transactionType'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.transactionType']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;

  ngOnInit() {
    this.hasError$ = this.transactionTypeMasterFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_LOC_006; // Update this
    this.transactionTypeMasterFacade
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
        this.transactionTypeMasterPageEvent.pageSize = pageSize;
        this.loadTransactionTypeMasterList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.isLoading$ = this.transactionTypeMasterFacade.getisLoading();

    this.transactionTypeMasterListing$ = this.transactionTypeMasterFacade.getTransactionTypeMasterListing();
    this.transactionTypeMasterCount$ = this.transactionTypeMasterFacade.getTotalDetails();

    this.transactionTypeMasterFacade
      .getTransactionTypeMasterDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const dialogRef = this.dialog.open(
            TransactionTypeMasterDetailsComponent,
            {
              width: '500px',
              height: 'auto',
              data: data
            }
          );

          dialogRef.afterClosed().subscribe(formData => {
            if (formData) {
              this.alertPopupService
                .open({
                  type: AlertPopupTypeEnum.CONFIRM,
                  message: 'pw.alertPopup.saveConfirmation'
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: boolean) => {
                  if (res) {
                    this.createTransactionTypeFormDetails(formData);
                  }
                });
            }
          });
        }
      });

    this.transactionTypeMasterFacade
      .getTransactionTypeMasterSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.loadTransactionTypeMasterList();
          this.showNotification('pw.taxClass.successMsg');
        }
      });

    this.transactionTypeMasterFacade
      .getTransactionTypeMasterEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2) {
          this.loadTransactionTypeMasterList();
          this.showNotification('pw.taxClass.editSuccessMsg');
        }
      });
  }

  createTransactionTypeFormDetails(data: any) {
    this.resetSearch = true;
    if (data.mode === 'new') {
      this.transactionTypeMasterFacade.saveFormDetails({
        code: data.code,
        value: data.value,
        isActive: data.isActive
      });
    } else if (data.mode === 'edit') {
      this.transactionTypeMasterFacade.editFormDetails({
        code: data.code,
        value: data.value,
        isActive: data.isActive
      });
    }
  }
  resetSearch = false;

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.transactionTypeMasterFacade.searchTransactionTypeMaster(
        searchValue.toUpperCase()
      );
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    // this.searchForm.reset();
    this.invalidSearch = false;
    this.loadTransactionTypeMasterList();
  }

  loadTransactionTypeMasterList() {
    this.transactionTypeMasterFacade.loadTransactionTypeMasterListing(
      this.transactionTypeMasterPageEvent
    );
  }

  paginate(pageEvent: PageEvent) {
    this.transactionTypeMasterPageEvent = pageEvent;
    this.loadTransactionTypeMasterList();
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
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
    // (event: OverlayNotificationEventRef) => {
    //   if (event.eventType === OverlayNotificationEventType.CLOSE) {
    //   }
    // }
  }

  backArrow() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PAYMENT_MENU_KEY
      }
    });
    this.transactionTypeMasterFacade.resetData();
  }

  getCode(code: string) {
    if (code !== 'NEW') {
      this.transactionTypeMasterFacade.loadTransactionTypeMasterByCode(code);
    } else {
      const newFormData: TransactionTypeMasterDetails = {
        code: 'NEW',
        value: '',
        isActive: false
      };
      const dialogRef = this.dialog.open(
        TransactionTypeMasterDetailsComponent,
        {
          width: '500px',
          height: 'auto',
          data: newFormData
        }
      );
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.createTransactionTypeFormDetails(data);
              }
            });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.transactionTypeMasterFacade.resetData();
  }
  omit_special_char($event: KeyboardEvent) {
    const pattern = /^[-_A-Za-z0-9]$/;
    return pattern.test($event.key);
  }

  updateIsActive(event: TransactionTypeMasterDetails) {
    this.clearSearch();
    this.transactionTypeMasterFacade.editFormDetails(event);
  }
}

/*
<div class="col-auto pw-top-heading-container__right-content">
<button class="pw-btn pw-accent-btn px-5" routerLinkActive="router-link-active"
    (click)="getCode('NEW')">
    {{'pw.transactionType.addNew' | translate}}
</button>
</div>
 */
