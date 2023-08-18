import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import {
  TaxMasterDetails,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { OverlayNotificationType } from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TaxMasterFacade } from '@poss-web/shared/tax-master/data-access-tax-master';
import { TaxMasterDetailsComponent } from '@poss-web/shared/tax-master/ui-tax-master-detail';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { TaxMasterViewComponent } from '@poss-web/shared/tax-master/ui-tax-master-view';

@Component({
  selector: 'poss-web-tax-master-listing',
  templateUrl: './tax-master-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxMasterListingComponent implements OnInit, OnDestroy {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();

  taxMasterPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  isLoading$: Observable<boolean>;
  taxMasterListing$: Observable<TaxMasterDetails[]>;
  taxMasterCount$: Observable<number>;

  hasError$: Observable<CustomErrors>;

  searchErrorCode1: string;
  searchErrorCode2: string;
  invalidSearch = false;
  resetSearch = false;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  noDataFoundMessageNonVerifiedItems: string;
  viewMode: boolean;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private taxMasterFacade: TaxMasterFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.taxCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.taxCode']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.hasError$ = this.taxMasterFacade.getError();
    this.searchErrorCode1 = ErrorEnums.ERR_LOC_007;
    this.searchErrorCode2 = ErrorEnums.ERR_CORE_038;

    this.taxMasterFacade
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
        this.taxMasterPageEvent.pageSize = pageSize;
        this.loadTaxMasterList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.isLoading$ = this.taxMasterFacade.getisLoading();

    this.taxMasterListing$ = this.taxMasterFacade.getTaxMasterListing();
    this.taxMasterCount$ = this.taxMasterFacade.getTotalTaxMasterDetails();

    this.taxMasterFacade
      .getTaxMasterDetailsByTaxCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewMode) {
            const dialogRef = this.dialog.open(TaxMasterViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(TaxMasterDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });

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
                      this.createTaxFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });

    this.taxMasterFacade
      .getTaxMasterSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.loadAndShowNotification('pw.taxMaster.successMsg');
        }
      });

    this.taxMasterFacade
      .getTaxMasterEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2) {
          this.loadAndShowNotification('pw.taxMaster.editSuccessMsg');
        }
      });
  }

  loadAndShowNotification(notificationKey: string) {
    this.loadTaxMasterList();
    if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
      this.showNotification(notificationKey);
    }
    if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
      this.showNotification('pw.global.listActivated');
    }
    if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
      this.showNotification('pw.global.listDeactivated');
    }
    this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  }

  // resetSearch = false;
  createTaxFormDetails(data: any) {
    this.resetSearch = true;
    if (data.mode === 'new') {
      this.taxMasterFacade.saveTaxMasterFormDetails({
        taxCode: data.taxCode,
        description: data.description,
        isActive: data.isActive,
        taxSystem: 'CESS'
      });
    } else if (data.mode === 'edit') {
      this.taxMasterFacade.editTaxMasterFormDetails({
        taxCode: data.taxCode,
        description: data.description,
        isActive: data.isActive,
        taxSystem: 'CESS'
      });
    }
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.taxMasterFacade.searchTaxMaster(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    // this.searchForm.reset();
    this.invalidSearch = false;
    this.loadTaxMasterList();
  }

  loadTaxMasterList() {
    this.taxMasterFacade.loadTaxMasterListing(this.taxMasterPageEvent);
  }

  paginate(pageEvent: PageEvent) {
    this.taxMasterPageEvent = pageEvent;
    this.loadTaxMasterList();
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    if (
      error.code === this.searchErrorCode1 ||
      error.code === this.searchErrorCode2
    ) {
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
        menu: MasterMenuKeyEnum.TAX_MENU_KEY
      }
    });
    this.taxMasterFacade.resetTaxMasterDialogData();
  }

  getTaxCodeView(taxCode: string) {
    this.viewMode = true;

    this.taxMasterFacade.loadTaxMasterDetailsByTaxCode(taxCode);
  }

  getTaxCode(taxCode: string) {
    this.viewMode = false;

    if (taxCode !== 'NEW') {
      this.taxMasterFacade.loadTaxMasterDetailsByTaxCode(taxCode);
    } else {
      const newFormData: TaxMasterDetails = {
        taxCode: 'NEW',
        description: '',
        isActive: false,
        taxSystem: 'CESS'
      };
      const dialogRef = this.dialog.open(TaxMasterDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: newFormData,
        disableClose: true
      });
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
                this.createTaxFormDetails(data);
              }
            });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.taxMasterFacade.resetTaxMasterDialogData();
  }
  omit_special_char($event: KeyboardEvent) {
    const pattern = /^[-_A-Za-z0-9]$/;
    return pattern.test($event.key);
  }

  // toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  updateIsActive(event) {
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

          this.clearSearch();
          this.taxMasterFacade.editTaxMasterFormDetails({
            taxCode: event.taxCode,
            description: null,
            isActive: event.isActive,
            taxSystem: 'CESS'
          });
        } else this.loadTaxMasterList();
      });
  }
}
