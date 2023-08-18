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
import {
  TaxClassDetails,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { Router } from '@angular/router';

import { TaxClassFacade } from '@poss-web/shared/tax-class/data-access-tax-class';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { takeUntil, take } from 'rxjs/operators';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { TaxClassDetailsComponent } from '@poss-web/shared/tax-class/ui-tax-class-detail';
import { TaxClassViewComponent } from '@poss-web/shared/tax-class/ui-tax-class-view';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-tax-class-listing',
  templateUrl: './tax-class-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxClassListingComponent implements OnInit, OnDestroy {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();

  taxClassPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  isLoading$: Observable<boolean>;
  taxClassListing$: Observable<TaxClassDetails[]>;
  taxClassCount$: Observable<number>;

  hasError$: Observable<CustomErrors>;

  searchErrorCode: string;
  invalidSearch = false;

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  viewMode: boolean;
  resetSearch = false;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private taxClassFacade: TaxClassFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.taxClassCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.taxClassCode']
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
    this.hasError$ = this.taxClassFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_LOC_006;
    this.taxClassFacade
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
        this.taxClassPageEvent.pageSize = pageSize;
        this.loadTaxClassList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.isLoading$ = this.taxClassFacade.getisLoading();

    this.taxClassListing$ = this.taxClassFacade.getTaxClassListing();
    this.taxClassCount$ = this.taxClassFacade.getTotalTaxClassDetails();

    this.taxClassFacade
      .getTaxClassDetailsByTaxClassCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewMode) {
            const dialogRef = this.dialog.open(TaxClassViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(TaxClassDetailsComponent, {
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
                      this.createProductCategoryFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });

    this.taxClassFacade
      .getTaxClassSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.loadTaxClassList();
          this.showNotification('pw.taxClass.successMsg');
        }
      });

    this.taxClassFacade
      .getTaxClassEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2) {
          this.loadTaxClassList();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.taxClass.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });
  }

  createProductCategoryFormDetails(data: any) {
    this.resetSearch = true;
    if (data.mode === 'new') {
      this.taxClassFacade.saveTaxClassFormDetails({
        taxClassCode: data.taxClassCode,
        description: data.description,
        isActive: data.isActive
      });
    } else if (data.mode === 'edit') {
      this.taxClassFacade.editTaxClassFormDetails({
        taxClassCode: data.taxClassCode,
        description: data.description,
        isActive: data.isActive
      });
    }
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.taxClassFacade.searchTaxClass(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    // this.searchForm.reset();
    this.invalidSearch = false;
    this.loadTaxClassList();
  }

  loadTaxClassList() {
    this.taxClassFacade.loadTaxClassListing(this.taxClassPageEvent);
  }

  paginate(pageEvent: PageEvent) {
    this.taxClassPageEvent = pageEvent;
    this.loadTaxClassList();
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
            hasClose: true,
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
        menu: MasterMenuKeyEnum.TAX_MENU_KEY
      }
    });
    this.taxClassFacade.resetTaxClassDialogData();
  }

  getTaxClassCodeView(taxClassCode: string) {
    this.viewMode = true;
    this.taxClassFacade.loadTaxClassDetailsByTaxClassCode(taxClassCode);
  }
  getTaxClassCode(taxClassCode: string) {
    this.viewMode = false;
    if (taxClassCode !== 'NEW') {
      this.taxClassFacade.loadTaxClassDetailsByTaxClassCode(taxClassCode);
    } else {
      const newFormData: TaxClassDetails = {
        taxClassCode: 'NEW',
        description: '',
        isActive: false
      };
      const dialogRef = this.dialog.open(TaxClassDetailsComponent, {
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
                this.createProductCategoryFormDetails(data);
              }
            });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.taxClassFacade.resetTaxClassDialogData();
  }
  omit_special_char($event: KeyboardEvent) {
    const pattern = /^[-_A-Za-z0-9]$/;
    return pattern.test($event.key);
  }

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

          this.resetSearch = true;
          this.invalidSearch = false;
          this.taxClassFacade.editTaxClassFormDetails({
            taxClassCode: event.taxClassCode,
            description: null,
            isActive: event.isActive
          });
        } else this.loadTaxClassList();
      });
  }
}
