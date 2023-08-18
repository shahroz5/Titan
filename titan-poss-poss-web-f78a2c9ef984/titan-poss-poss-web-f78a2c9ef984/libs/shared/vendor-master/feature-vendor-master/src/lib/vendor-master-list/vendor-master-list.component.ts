import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  AlertPopupTypeEnum,
  MasterMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  vendorMasterEnum,
  VendorMaster,
  VENDOR_CODE_ENUMS
} from '@poss-web/shared/models';
import { OverlayNotificationType } from '@poss-web/shared/models';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';

import { VendorMasterFacade } from '@poss-web/shared/vendor-master/data-access-vendor-master';
import {
  PaymentAirpayComponent,
  AwsS3Component,
  DialMilestoneComponent,
  DialTridentComponent,
  EmailValidationTitanComponent,
  EmailGmailComponent,
  EpossSftpComponent,
  ErpApiComponent,
  GhsComponent,
  IrnAsptaxComponent,
  LegacyApiComponent,
  PanKhoslaComponent,
  PaymentRazorpayComponent,
  PossTitanComponent,
  UlpNetcarrotsComponent,
  SafeGoldComponent,
  SmsKapComponent,
  QcGcComponent
} from '@poss-web/shared/vendor-master/ui-vendor-master-details';

@Component({
  selector: 'poss-web-vendor-master-list',
  templateUrl: './vendor-master-list.component.html',
  styleUrls: ['./vendor-master-list.component.scss']
})
export class VendorMasterListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  searchErrorCode: string;
  pageSizeOptions: number[];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  invalidSearch: boolean;
  vendorMasterList$: Observable<VendorMaster[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  noDataFoundMessage: string;

  constructor(
    private dialog: MatDialog,
    private vendorMasterFacade: VendorMasterFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate
      .get(['pw.entity.vendorMasterEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.vendorMasterEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnInit() {
    this.vendorMasterFacade.loadReset();

    this.isLoading$ = this.vendorMasterFacade.getIsloading();
    this.error$ = this.vendorMasterFacade.getError();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;

        this.loadVendorMasterList();
        this.vendorMasterList$ = this.vendorMasterFacade.getVendorMasterList();
        this.totalElements$ = this.vendorMasterFacade.getTotalElements();
      });
    this.vendorMasterFacade
      .getVendorMaster()
      .pipe(takeUntil(this.destroy$))
      .subscribe(vendorMaster => {
        if (vendorMaster) {
          this.openVendorDetailPopUp(vendorMaster);
        }
      });

    this.vendorMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search(searchValue) {
    this.vendorMasterFacade.searchVendorMaster(searchValue);
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadVendorMasterList();
  }
  loadVendorMasterList() {
    this.vendorMasterFacade.loadVendorMasterList({
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize
    });
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadVendorMasterList();
  }

  openViewPage(vendorCode) {
    this.vendorMasterFacade.loadVendorMasterByCode(vendorCode);
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === 'ERR-INT-015') {
      this.invalidSearch = true;
      // We are not showing error for location not found from search.
      return;
    } else {
      this.invalidSearch = false;
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      });
    }
  }
  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_ATTRIBUTES_MENU_KEY
      }
    });
    this.vendorMasterFacade.loadReset();
  }
  openVendorDetailPopUp(vendorMaster) {
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.PAYMENT_AIRPAY) {
      const dialogRef = this.dialog.open(PaymentAirpayComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.AWS_S3) {
      const dialogRef = this.dialog.open(AwsS3Component, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.DIAL_MILESTONE) {
      const dialogRef = this.dialog.open(DialMilestoneComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.DIAL_TRIDENT) {
      const dialogRef = this.dialog.open(DialTridentComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.EMAIL_VALIDATION_TITAN) {
      const dialogRef = this.dialog.open(EmailValidationTitanComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.EMAIL_GMAIL) {
      const dialogRef = this.dialog.open(EmailGmailComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.EPOSS_SFTP) {
      const dialogRef = this.dialog.open(EpossSftpComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.ERP_API) {
      const dialogRef = this.dialog.open(ErpApiComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.GHS) {
      const dialogRef = this.dialog.open(GhsComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.IRN_ASPTAX) {
      const dialogRef = this.dialog.open(IrnAsptaxComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.LEGACY_API) {
      const dialogRef = this.dialog.open(LegacyApiComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.PAN_KHOSLA) {
      const dialogRef = this.dialog.open(PanKhoslaComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.PAYMENT_RAZORPAY) {
      const dialogRef = this.dialog.open(PaymentRazorpayComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.ULP_NETCARROTS) {
      const dialogRef = this.dialog.open(UlpNetcarrotsComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.QC_GC) {
      const dialogRef = this.dialog.open(QcGcComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.SAFE_GOLD) {
      const dialogRef = this.dialog.open(SafeGoldComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }

    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.SMS_KAP) {
      const dialogRef = this.dialog.open(SmsKapComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
    if (vendorMaster.vendorCode === VENDOR_CODE_ENUMS.POSS_TITAN) {
      const dialogRef = this.dialog.open(PossTitanComponent, {
        width: '600px',
        height: 'auto',
        data: vendorMaster,
        disableClose: true
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
