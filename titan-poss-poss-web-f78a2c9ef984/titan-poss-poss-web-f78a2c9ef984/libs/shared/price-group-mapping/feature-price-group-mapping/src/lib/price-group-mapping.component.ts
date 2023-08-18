import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors,
  LocationPriceGroupMapping,
  LocationPriceGroupMappingList,
  LocationSummaryList,
  Lov,
  MasterMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PriceGroupMaster
} from '@poss-web/shared/models';
import { PriceGroupMappingFacade } from '@poss-web/shared/price-group-mapping/data-access-price-group-mapping';
import {
  getLocationDetailsLocationRouteUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';

import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'poss-web-price-group-mapping',
  templateUrl: './price-group-mapping.component.html',
  styles: []
})
export class PriceGroupMappingComponent implements OnInit, OnDestroy {
  constructor(
    private priceGroupMappingFacade: PriceGroupMappingFacade,
    private selectionDialog: SelectionDialogService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private router: Router
  ) {
    this.translate
      .get([
        'pw.instock.selectLocationPlaceHolder',
        'pw.instock.selectDestinationBinLableText',
        'pw.priceGroupMapping.selectPriceGroupCode',
        'pw.priceGroupMapping.searchByPriceGroupCode',
        'pw.priceGroupMapping.selectPriceGroupTypeCode',
        'pw.priceGroupMapping.searchByPriceGroupTypeCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectLocationLableText =
          translatedMessages['pw.instock.selectDestinationBinLableText'];
        this.searchLocationPlaceHolder =
          translatedMessages['pw.instock.selectLocationPlaceHolder'];
        this.selectPriceGroupCodeLableText =
          translatedMessages['pw.priceGroupMapping.selectPriceGroupCode'];
        this.searchPriceGroupCodePlaceHolder =
          translatedMessages['pw.priceGroupMapping.searchByPriceGroupCode'];
        this.selectPriceGroupTypeCodeLableText =
          translatedMessages['pw.priceGroupMapping.selectPriceGroupTypeCode'];
        this.searchPriceGroupTypeCodePlaceHolder =
          translatedMessages['pw.priceGroupMapping.searchByPriceGroupTypeCode'];
      });
  }

  destroy$: Subject<null> = new Subject<null>();
  navigateLocationCode: string;
  locationCode: string;

  locationForSelection: SelectionDailogOption[] = [];
  priceGroupCodeForSelection: SelectionDailogOption[] = [];
  priceGroupTypeCodeForSelection: SelectionDailogOption[] = [];
  selectedLocation: SelectionDailogOption;
  selectedPriceGroupCode: SelectionDailogOption;
  selectedPriceGroupTypeCode: SelectionDailogOption;

  searchLocationPlaceHolder: string;
  selectLocationLableText: string;
  selectPriceGroupCodeLableText: string;
  searchPriceGroupCodePlaceHolder: string;
  selectPriceGroupTypeCodeLableText: string;
  searchPriceGroupTypeCodePlaceHolder: string;

  locationPriceGroupMappingList$: Observable<LocationPriceGroupMappingList[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  hasSaved$: Observable<boolean>;
  mode: boolean; // true- Adding, false- removing

  ngOnInit(): void {
    this.priceGroupMappingFacade.loadResetLocationPriceGroupMapping();
    this.locationCode = this.activatedRoute.snapshot.params['_locCode'];

    if (this.locationCode) {
      this.navigateLocationCode = this.locationCode;
      this.selectedLocation = {
        id: this.locationCode,
        description: this.locationCode
      };

      this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
        this.locationCode
      );
    }

    this.priceGroupMappingFacade.loadPriceGroupList();
    this.priceGroupMappingFacade.loadLocationList();
    this.priceGroupMappingFacade.loadPriceGroupTypeList();

    this.isLoading$ = this.priceGroupMappingFacade.getIsloading();
    this.locationPriceGroupMappingList$ = this.priceGroupMappingFacade.getLocationPriceGroupMappingList();

    this.priceGroupMappingFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
            this.locationCode
          );

          if (this.mode) {
            this.selectedPriceGroupCode = {
              id: '',
              description: ''
            };
            this.selectedPriceGroupTypeCode = {
              id: '',
              description: ''
            };
            this.showNotification('pw.priceGroupMapping.mappingSaved');
          } else {
            this.showNotification('pw.priceGroupMapping.mappingRemoved');
          }
        }
      });

    this.priceGroupMappingFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === 'ERR-LOC-031') {
            return;
          }
          this.errorHandler(error);
        }
      });

    this.priceGroupMappingFacade
      .getLocationList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });

    this.priceGroupMappingFacade
      .getPriceGroupList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PriceGroupMaster[]) => {
        if (data) {
          this.priceGroupCodeForSelection = data.map(res => ({
            id: res.priceGroup,
            description: res.priceGroup + ' - ' + res.description
          }));
        }
      });

    this.priceGroupMappingFacade
      .getPriceGroupTypeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Lov[]) => {
        if (data) {
          this.priceGroupTypeCodeForSelection = data.map(res => ({
            id: res.code,
            description: res.code + ' - ' + res.value
          }));
        }
      });
  }

  back() {
    if (this.navigateLocationCode) {
      this.router.navigate([
        getLocationDetailsLocationRouteUrl(this.navigateLocationCode)
      ]);
    } else {
      this.router.navigate([getMasterHomeRouteUrl()], {
        queryParams: {
          menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
        }
      });
    }
  }

  openLocationSelectionPopup() {
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = selectedOption.id;
          this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
            this.locationCode
          );
        }
      });
  }

  openPriceGroupCodeSelectionPopup() {
    this.selectionDialog
      .open({
        title: this.selectPriceGroupCodeLableText,
        placeholder: this.searchPriceGroupCodePlaceHolder,
        options: this.priceGroupCodeForSelection
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedPriceGroupCode = selectedOption;
        }
      });
  }

  openPriceGroupTypeCodeSelectionPopup() {
    this.selectionDialog
      .open({
        title: this.selectPriceGroupTypeCodeLableText,
        placeholder: this.searchPriceGroupTypeCodePlaceHolder,
        options: this.priceGroupTypeCodeForSelection
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedPriceGroupTypeCode = selectedOption;
        }
      });
  }

  LocationPriceGroupMapping(
    locationPriceGroupMapping: LocationPriceGroupMapping
  ) {
    if (this.locationCode) {
      if (locationPriceGroupMapping.addPriceGroup.length) {
        this.mode = true;
        this.priceGroupMappingFacade.saveLocationPriceGroupMapping(
          this.locationCode,
          locationPriceGroupMapping
        );
      }
      if (locationPriceGroupMapping.removePriceGroup.length) {
        this.mode = false;

        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.removeConfirmation'
          })
          .pipe(take(1))
          .subscribe((result: boolean) => {
            if (result) {
              this.priceGroupMappingFacade.saveLocationPriceGroupMapping(
                this.locationCode,
                locationPriceGroupMapping
              );
            }
          });
      }
    }
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

  clearLocationSelection(event: boolean) {
    this.selectedLocation = {
      id: '',
      description: ''
    };
    this.priceGroupMappingFacade.loadLocationPriceGroupMappingList('');
  }

  clearProductGroupCodeSelection(event: boolean) {
    this.selectedPriceGroupCode = {
      id: '',
      description: ''
    };
  }
  clearProductGroupTypeCodeSelection(event: boolean) {
    this.selectedPriceGroupTypeCode = {
      id: '',
      description: ''
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
