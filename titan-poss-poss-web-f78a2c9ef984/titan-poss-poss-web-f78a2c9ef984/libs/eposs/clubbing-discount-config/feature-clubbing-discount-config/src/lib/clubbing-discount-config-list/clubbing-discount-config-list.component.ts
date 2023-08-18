import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ClubbingDiscountAddRulePopupComponent } from '@poss-web/eposs/clubbing-discount-config/ui-clubbing-discount-popup';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  DiscountTypeBasedCodes,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { getDiscountsDashBoardRouteUrl } from '@poss-web/shared/util-site-routes';
import { ClubDiscountsFacade } from '@poss-web/eposs/clubbing-discount-config/data-access-clubbing-discount-config';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-clubbing-discount-config-list',
  templateUrl: './clubbing-discount-config-list.component.html'
})
export class ClubbingDiscountConfigListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject<null>();
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
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  totalElements$: Observable<number>;
  clubbedDiscountsData$: Observable<any>;
  clubbedDiscountsList = [];
  searchFormControl = new FormControl();
  @ViewChild('discountCodeSearch')
  discountCodeSearch: ElementRef;
  searchValue: string;
  invalidSearch = false;
  type1DiscountCodes: DiscountTypeBasedCodes[];
  type2DiscountCodes: DiscountTypeBasedCodes[];
  type3DiscountCodes: DiscountTypeBasedCodes[];
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private clubDiscountsFacade: ClubDiscountsFacade
  ) {}

  ngOnInit() {
    this.clubDiscountsFacade.resetData();
    this.clubDiscountsFacade.loadType1DiscountCodes('TYPE1');
    this.clubDiscountsFacade.loadType2DiscountCodes('TYPE2');
    this.clubDiscountsFacade.loadType3DiscountCodes('TYPE3');

    this.clubDiscountsFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saveSuccess => {
        if (saveSuccess) {
          this.showNotifications('pw.clubbingDiscounts.saveSuccessMessage');
        }
      });
    this.hasError$ = this.clubDiscountsFacade.getError();
    this.isLoading$ = this.clubDiscountsFacade.getIsLoading();
    this.totalElements$ = this.clubDiscountsFacade.getTotalElements();
    this.clubbedDiscountsData$ = this.clubDiscountsFacade.getClubbedDiscountList();
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.listingPageEvent.pageSize = pageSize;
        this.loadDetails();
      });
    this.clubDiscountsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
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

    this.clubbedDiscountsData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        if (data) {
          this.clubbedDiscountsList = data;
          this.length = data.length;
        }
      });

    this.clubDiscountsFacade
      .getType1DiscountCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((type1Codes: DiscountTypeBasedCodes[]) => {
        if (type1Codes) {
          console.log(type1Codes, 'type1Codes');
          this.type1DiscountCodes = type1Codes;
        }
      });
    this.clubDiscountsFacade
      .getType2DiscountCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((type2Codes: DiscountTypeBasedCodes[]) => {
        if (type2Codes) {
          console.log(type2Codes, 'type2Codes');

          this.type2DiscountCodes = type2Codes;
        }
      });
    this.clubDiscountsFacade
      .getType3DiscountCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((type3Codes: DiscountTypeBasedCodes[]) => {
        if (type3Codes) {
          console.log(type3Codes, 'type3Codes');
          this.type3DiscountCodes = type3Codes;
        }
      });
    this.clubDiscountsFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.loadDetails();
        }
      });
  }
  loadDetails() {
    if (
      this.searchFormControl.value !== '' &&
      this.searchFormControl.value !== null &&
      this.searchFormControl.value !== undefined
    ) {
      this.clubDiscountsFacade.loadClubbedDiscountsList(
        this.listingPageEvent,
        this.searchFormControl.value.toUpperCase()
      );
    } else {
      this.clubDiscountsFacade.loadClubbedDiscountsList(this.listingPageEvent);
    }
  }
  ngAfterViewInit() {
    if (this.discountCodeSearch) {
      fromEvent(this.discountCodeSearch.nativeElement, 'input')
        .pipe(debounceTime(1000), takeUntil(this.destroy$))
        .subscribe((event: any) => {
          this.searchValue = this.searchFormControl.value.toUpperCase();
          if (this.searchValue) {
            this.clubDiscountsFacade.loadClubbedDiscountsList(
              this.listingPageEvent,
              this.searchValue.toUpperCase()
            );
          } else {
            this.clearSearch();
          }
        });
    }
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
            this.overlayNotification.close();
          });
      });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === 'ERR_CONFIG_063') {
      this.clubbedDiscountsList = [];
    } else {
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
  }
  addRule() {
    this.dialog
      .open(ClubbingDiscountAddRulePopupComponent, {
        autoFocus: false,
        width: '350px',
        data: {
          type1: this.type1DiscountCodes,
          type2: this.type2DiscountCodes,
          type3: this.type3DiscountCodes
        }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log(res, 'res');
          this.clubDiscountsFacade.saveClubbedDiscountList({
            addRules: [
              {
                type1DiscountCode: res.type1,
                type2DiscountCode: res.type2,
                type3DiscountCode: res.type3
              }
            ],
            removeRules: []
          });
        }
      });
  }
  deleteRow(data) {
    this.clubDiscountsFacade.deleteRowData(data.id);
    this.clubDiscountsFacade.saveClubbedDiscountList({
      addRules: null,
      removeRules: [data.id]
    });
  }
  clearSearch() {
    this.searchFormControl.reset();
    this.invalidSearch = false;
    this.loadDetails();
  }
  back() {
    this.router.navigate([getDiscountsDashBoardRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.DISCOUNTS
      }
    });
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
