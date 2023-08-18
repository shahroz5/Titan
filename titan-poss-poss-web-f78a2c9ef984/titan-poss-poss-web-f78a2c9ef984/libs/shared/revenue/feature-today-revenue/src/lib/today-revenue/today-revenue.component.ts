import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomErrors,
  RevenueTypesEnum,
  TodayRevenueResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SharedBodEodFeatureServiceAbstraction,
  BankingAndRevenueMenuKeyEnum
} from '@poss-web/shared/models';
import { RevenueFacade } from '@poss-web/shared/revenue/data-access-revenue';
import { Observable, Subject } from 'rxjs';
import { getBankingAndRevenueHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { takeUntil } from 'rxjs/operators';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-today-revenue',
  templateUrl: './today-revenue.component.html'
})
export class TodayRevenueComponent implements OnDestroy {
  revenueTypeEnumRef = RevenueTypesEnum;

  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  todayRevenueList$: Observable<TodayRevenueResponse>;
  ghsRevenueList$: Observable<TodayRevenueResponse>;
  serviceRevenueList$: Observable<TodayRevenueResponse>;
  locationCode = '';
  locationForSelection: SelectionDailogOption[] = [];
  selectLocationLableText = 'Select Location Code';
  searchLocationPlaceHolder = 'Search By Location Code';
  selectedLocation: SelectionDailogOption;
  locationFilter = {
    brands: null,
    regions: null,
    levels: null,
    countries: null,
    states: null,
    towns: null
  };
  isCorpUser: boolean;
  bussinessDay: number;

  constructor(
    private router: Router,
    private revenueFacade: RevenueFacade,
    private locationMappingFacade: LocationMappingFacade,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private profiledatafacade: ProfileDataFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.isLoading$ = this.revenueFacade.getIsLoading();
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = data;
      });
    this.revenueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.profiledatafacade
      .isCorpUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        this.isCorpUser = val1;
        if (this.isCorpUser === true) {
          this.locationMappingFacade.searchLocations(this.locationFilter);
          this.locationMappingFacade
            .getLocations()
            .pipe(takeUntil(this.destroy$))
            .subscribe((locations: any) => {
              if (locations) {
                this.locationForSelection = locations.map(location => ({
                  id: location.locationCode,
                  description:
                    location.locationCode + ' - ' + location.description
                }));
              }
            });
        } else if (this.isCorpUser === false) {
          this.revenueFacade.loadTodayReveune(this.locationCode);
          this.todayRevenueList$ = this.revenueFacade.getTodayRevenueList();
          this.revenueFacade.loadGhsReveune({
            businessDate: this.bussinessDay
          });
          this.ghsRevenueList$ = this.revenueFacade.getGhsRevenueList();
          this.revenueFacade.loadServiceReveune({
            businessDate: this.bussinessDay
          });
          this.serviceRevenueList$ = this.revenueFacade.getServiceRevenueList();
        }
      });
  }

  getLocationCode() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = selectedOption.id;
        }
      });
  }

  dateFormat(date) {
    return moment(Number(date));
  }

  loadSelectedLocation(locationCode: string) {
    this.revenueFacade.loadTodayReveune(locationCode);
    this.todayRevenueList$ = this.revenueFacade.getTodayRevenueList();
    this.revenueFacade.loadGhsReveune({ locationCode: locationCode });
    this.ghsRevenueList$ = this.revenueFacade.getGhsRevenueList();
    this.revenueFacade.loadServiceReveune({ locationCode: locationCode });
    this.serviceRevenueList$ = this.revenueFacade.getServiceRevenueList();
  }

  back() {
    this.router.navigate([getBankingAndRevenueHomeRouteUrl()], {
      queryParams: {
        menu: BankingAndRevenueMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }

  errorHandler(error: CustomErrors) {
    if (error) {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasBackdrop: true,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.revenueFacade.resetError();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
