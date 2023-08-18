import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  Inject
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';

import { TranslateService } from '@ngx-translate/core';
import {
  AppTypesEnum,
  CustomErrors,
  LocationSettingAttributesEnum,
  MasterMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  StoneFilter,
  OverlayNotificationType,
  StoneDetails
} from '@poss-web/shared/models';

import { StoneFacade } from '@poss-web/shared/stone/data-access-stone';

import { POSS_APP_TYPE } from '@poss-web/shared/util-config';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-stone-listing',
  templateUrl: './stone-listing.component.html'
})
export class StoneListingComponent implements OnInit, OnDestroy {
  @Output() formEmit = new EventEmitter<any>();
  destroy$ = new Subject<null>();

  pageSizeOptions: number[] = [];
  minPageSize = 0;

  stoneDetailsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  isLoading$: Observable<boolean>;
  StoneListingComponent$: Observable<StoneDetails[]>;
  filteredList$: Observable<any>;
  stoneCount$: Observable<number>;
  // hasError$: Observable<CustomErrors>;

  stoneCount: number;
  // searchErrorCode: string;
  invalidSearch = false;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  stoneFilter: StoneFilter;
  filterLoaded: boolean;
  filterStoneData;
  filterForm: FormGroup;

  currencyCode: string;
  noDataFoundMessage: any;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,

    private overlayNotification: OverlayNotificationServiceAbstraction,
    private stoneFacade: StoneFacade,
    public locationSettingsFacade: LocationSettingsFacade,
    @Inject(POSS_APP_TYPE) private appType
  ) {
    this.translate
      .get(['pw.entity.stoneEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.stoneEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.stoneFacade.loadResetFilter();

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    // this.hasError$ = this.stoneFacade.getError();
    // this.searchErrorCode = ErrorEnums.ERR_PRO_008;
    // this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.stoneFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (!!data) {
          const pageSize = JSON.parse(data.toString());
          this.stoneDetailsPageEvent.pageSize = pageSize;
        }
        if (this.filterStoneData) this.loadFilteredStoneDetails();
      });

    this.isLoading$ = this.stoneFacade.getisLoading();
    this.StoneListingComponent$ = this.stoneFacade.getStoneDetailsListing();
    this.stoneCount$ = this.stoneFacade.getTotalStoneDetails();
    this.stoneFacade
      .getStoneFilter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterData: StoneFilter) => {
        if (filterData) {
          this.filterStoneData = filterData.payloadData;
        } else this.filterStoneData = null;
      });
  }

  loadFilteredStoneDetails() {
    this.stoneFacade.loadFilteredStoneList({
      payloadData: this.filterStoneData ? this.filterStoneData : null,
      pageIndex: this.stoneDetailsPageEvent.pageIndex,
      pageSize: this.stoneDetailsPageEvent.pageSize
    });
  }
  applyFilter(filterPayload) {
    this.filterLoaded = true;
    this.stoneDetailsPageEvent = this.initialPageEvent;
    this.filterStoneData = filterPayload;
    this.loadFilteredStoneDetails();
  }

  clear(event) {
    if (event) {
      this.stoneFacade.loadResetFilter();
      this.filterLoaded = false;
    }
  }

  paginate(pageEvent: PageEvent) {
    this.stoneDetailsPageEvent = pageEvent;
    if (this.filterLoaded) this.loadFilteredStoneDetails();
    // else this.loadStoneDetails();
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
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  errorHandler(error: CustomErrors) {
    // if (error.code === this.searchErrorCode) {
    //   return;
    // }

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

  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu:
          this.appType === AppTypesEnum.POSS
            ? MasterMenuKeyEnum.BOUTIQUE_MENU_KEY
            : MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
