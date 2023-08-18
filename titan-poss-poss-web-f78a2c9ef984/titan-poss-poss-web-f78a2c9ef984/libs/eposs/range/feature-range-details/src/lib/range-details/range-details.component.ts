import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RangeFacade } from '@poss-web/eposs/range/data-access-range';
import {
  AlertPopupServiceAbstraction,
  ConfigurationRanges,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  AlertPopupTypeEnum,
  Lov,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RangeTypes
} from '@poss-web/shared/models';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-range-details',
  templateUrl: './range-details.component.html'
})
export class RangeDetailsComponent implements OnInit, OnDestroy {
  rangeTypes: RangeTypes[];
  rangePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions = [];
  destroy$ = new Subject<null>();
  configType: string;
  ranges: ConfigurationRanges[];
  totalElements$: Observable<number>;
  minPageSize: number;
  isLoading$: Observable<boolean>;
  sno = 1;
  context = this;
  rangeFormGroup: FormGroup;
  constructor(
    private router: Router,
    private rangeFacade: RangeFacade,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.rangeFacade.resetRanges();
    this.rangeFacade.loadRangeTypes('RANGE_TYPE');
    this.isLoading$ = this.rangeFacade.getIsLoading();
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.rangePageEvent.pageSize = pageSize;
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

    this.rangeFacade
      .getRanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ranges: ConfigurationRanges[]) => {
        if (ranges) {
          this.ranges = [];
          this.sno = 1;
          for (const range of ranges) {
            this.ranges.push({
              fromRange: range.fromRange,
              toRange: range.toRange,
              id: range.id,
              rowId: range.rowId,
              isActive: range.isActive
            });
          }
        }
      });
    this.rangeFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.showSuccessMessageNotification('pw.range.saveSuccessMsg');
          this.loadRanges();
        }
      });
    this.rangeFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === 'ERR-CORE-032') {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: error.errorCause
            });
          } else this.errorHandler(error);
        }
      });
    this.rangeFacade
      .getRangeTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rangeTypes: Lov[]) => {
        if (rangeTypes) {
          this.rangeTypes = [];
          rangeTypes.forEach(rangeType => {
            this.rangeTypes.push({
              value: rangeType.code,
              description: rangeType.value
            });
          });
          this.configType = rangeTypes[0].code;
          this.rangeFormGroup.patchValue({ rangeType: this.configType });
          this.loadRanges();
        }
      });
  }
  createForm() {
    this.rangeFormGroup = new FormGroup({
      rangeType: new FormControl(
        this.rangeTypes ? this.rangeTypes[0]?.value : ''
      )
    });
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
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
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
  }
  rangeType(rangeType) {
    this.configType = rangeType;
    this.loadRanges();
  }
  paginate($event) {
    this.rangePageEvent = $event;
    this.loadRanges();
  }
  loadRanges() {
    this.rangeFacade.loadRanges(this.configType);
  }
  saveRanges($event) {
    this.rangeFacade.saveRanges({
      rangeType: this.configType,
      savePayload: $event
    });
  }
  deleteRange($event) {
    this.rangeFacade.saveRanges({
      rangeType: this.configType,
      savePayload: {
        addRanges: [],
        updateRanges: [],
        removeRanges: [$event]
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  backArrow() {
    this.rangeFacade.resetRanges();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: { menu: ConfigurationsMenuKeyEnum.GLOBAL_MENU_KEY }
    });
  }
}
