import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TepProductGroupConfigFacade } from '@poss-web/eposs/tep-product-group/data-access-tep-product-group';
import {
  AddTEPProductGroupsMapping,
  AlertPopupServiceAbstraction,
  ConfigTypeEnum,
  CustomErrors,
  AlertPopupTypeEnum,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductGroupMappingFormType,
  ProductGroupMappingServiceAbstraction,
  ProductGroupWithFormServiceResponse,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigEnum,
  TEPProductGroupMappingDetails,
  TEPProductGroupMappingGridData,
  ProductGroupMappingOption
} from '@poss-web/shared/models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  getTepProductGroupConfigDetailsRouteUrl,
  getTepProductGroupConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { MatDialog } from '@angular/material/dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { TepProductGroupEditDialogComponent } from '@poss-web/eposs/tep-product-group/ui-tep-product-group-detail';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-tep-product-group-detail',
  templateUrl: './tep-product-group-detail.component.html',
  styles: []
})
export class TepProductGroupDetailComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private tepProductGroupConfigFacade: TepProductGroupConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  mappedLocations = [];
  showViewOnly: boolean;

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  totalMappingElements$: Observable<number>;
  tepProductGroupConfigDetails$: Observable<TEPProductGroupConfigDetails>;
  tepProductGroupConfigDetails: TEPProductGroupConfigDetails;
  tepProductGroupMappingList$: BehaviorSubject<
    TEPProductGroupMappingDetails[]
  > = new BehaviorSubject<TEPProductGroupMappingDetails[]>([]);
  tepProductGroupMappingList: TEPProductGroupMappingDetails[] = [];

  mappingListingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  pageSize: number;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  isGridModified = false;

  configId: string;
  updated$: Observable<boolean>;
  buttonText: string;
  productGroups: ProductGroupMappingOption[] = [];

  sortData: string[] = [];

  ngOnInit(): void {
    this.sortData = [];
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly ? true : false;
      });
    this.buttonText = this.translate.instant('pw.alertPopup.okayButtonText');

    this.configId = this.activatedRoute.snapshot.params['_id'];
    this.isLoading$ = this.tepProductGroupConfigFacade.getIsloading();
    this.totalMappingElements$ = this.tepProductGroupConfigFacade.getTotalMappingElements();

    this.tepProductGroupConfigFacade.loadTepProductGroupConfigDetails(
      this.configId
    );

    this.tepProductGroupConfigDetails$ = this.tepProductGroupConfigFacade.getTepProductGroupConfigDetails();
    this.tepProductGroupConfigFacade
      .getTepProductGroupMappingList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.tepProductGroupMappingList$.next(data);
        if (data) {
          this.productGroups = [];
          for (const dataNew of data) {
            this.productGroups.push({
              uuid: dataNew.id,
              id: dataNew.productGroupCode
            });
          }
        }
      });

    this.tepProductGroupConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepProductGroupConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.tepProductGroupConfigDetails$.pipe(take(1)).subscribe(data => {
            this.configId = data.configId;
            if (data.configId) {
              if (this.addTEPProductGroupsMapping.addProductGroups.length) {
                this.tepProductGroupConfigFacade.saveTepProductGroupMappingDetails(
                  this.configId,
                  this.addTEPProductGroupsMapping
                );
              }

              this.router.navigate([
                getTepProductGroupConfigDetailsRouteUrl(),
                data.configId
              ]);

              this.showLocMappingAlertMessage();
            }
          });
          this.showNotification(
            'pw.tepProductGroupConfig.TEPProductGroupConfigurationSaved'
          );
        }
      });
    this.updated$ = this.tepProductGroupConfigFacade.getHasUpdated();
    this.tepProductGroupConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification(
            'pw.tepProductGroupConfig.TEPProductGroupConfigurationUpdated',
            true
          );

          if (this.isGridModified) {
            this.loadTepProductGroupMappingList();
            this.isGridModified = false;
          }
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
        this.pageSize = data;
        this.mappingListingPageEvent.pageSize = this.pageSize;
        this.loadTepProductGroupMappingList();
      });

    if (this.configId !== 'new') {
      this.locationMappingFacade.loadMappedLocations({
        ruleType: ConfigTypeEnum.TEP_ITEM,
        ruleID: this.configId
      });
    }
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });
  }

  backArrow() {
    this.router.navigate([getTepProductGroupConfigListRouteUrl()]);
  }

  paginate(pageEvent: PageEvent) {
    this.mappingListingPageEvent = pageEvent;
    this.loadTepProductGroupMappingList();
  }

  sort(sortEvent: string[]) {
    this.mappingListingPageEvent.pageIndex = 0;
    this.sortData = [...sortEvent];
    this.loadTepProductGroupMappingList();
  }

  loadTepProductGroupMappingList() {
    if (this.configId !== TEPProductGroupConfigEnum.NEW) {
      this.tepProductGroupConfigFacade.loadTepProductGroupMappingList({
        configId: this.configId,
        pageIndex: this.mappingListingPageEvent.pageIndex,
        pageSize: this.mappingListingPageEvent.pageSize,
        sort: this.sortData
      });
    }
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

  showNotification(key: string, navigateBack = false) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: this.buttonText,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(() => {
            if (navigateBack) {
              this.backArrow();
            }
          });
      });
  }

  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.tepStoneConfig.selAtleaseOneLocation'
      })
      .pipe(take(1))
      .subscribe();
  }

  tepProductGroupConfigDetailsFormOutput(
    event: TEPProductGroupConfigDetails,
    showConfirm = true
  ) {
    if (
      this.addTEPProductGroupsMapping.addProductGroups.length === 0 &&
      this.configId === 'NEW'
    ) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.INFO,
          message: 'pw.tepStoneConfig.addAtleaseOneProductGroup'
        })
        .pipe(take(1))
        .subscribe();
    } else {
      if (showConfirm) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.tepProductGroupConfigDetails = event;
              if (event.configId) {
                this.tepProductGroupConfigFacade.updateTepProductGroupConfigDetails(
                  {
                    ...event,
                    configId: this.configId
                  }
                );
              } else {
                this.tepProductGroupConfigFacade.saveTepProductGroupConfigDetails(
                  {
                    ...event,
                    configId: this.configId
                  }
                );
              }
            }
          });
      } else {
        this.tepProductGroupConfigDetails = event;
        if (event.configId) {
          this.tepProductGroupConfigFacade.updateTepProductGroupConfigDetails({
            ...event,
            configId: this.configId
          });
        } else {
          this.tepProductGroupConfigFacade.saveTepProductGroupConfigDetails({
            ...event,
            configId: this.configId
          });
        }
      }
    }
  }

  addTEPProductGroupsMapping: AddTEPProductGroupsMapping = {
    addProductGroups: []
  };

  openProductGroupMapping() {
    this.productGroupMappingServiceAbstraction
      .openProductGroupMappingWithForm({
        formType: ProductGroupMappingFormType.TEP_PRODUCT_GROUP_CONFIG_MAPPING,
        formData: [],
        selectedProductGroup: this.productGroups
      })
      .subscribe((res: ProductGroupWithFormServiceResponse) => {
        if (res.data) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(take(1))
            .subscribe((result: boolean) => {
              if (result) {
                if (this.configId === 'new') {
                  this.addTEPProductGroupsMapping = {
                    addProductGroups: []
                  };
                }
                res.data.prouctGroups.addedProductGroups.forEach(
                  productGroup => {
                    const found = this.addTEPProductGroupsMapping.addProductGroups.some(
                      el => el.productGroupCode === productGroup.id
                    );

                    if (!found) {
                      this.addTEPProductGroupsMapping.addProductGroups.push({
                        productGroupCode: productGroup.id,
                        configDetails: {
                          data: res.data.config,
                          type: TEPProductGroupConfigEnum.TEP_PRODUCT_CONFIG
                        }
                      });
                    }
                  }
                );

                if (this.configId !== 'NEW') {
                  this.tepProductGroupConfigFacade.saveTepProductGroupMappingDetails(
                    this.configId,
                    this.addTEPProductGroupsMapping
                  );
                } else {
                  this.tepProductGroupMappingList = [];
                  let i = 0;
                  this.addTEPProductGroupsMapping.addProductGroups.forEach(
                    productData => {
                      i++;
                      this.tepProductGroupMappingList.push({
                        configDetails: {
                          type: TEPProductGroupConfigEnum.TEP_PRODUCT_CONFIG,
                          data: productData.configDetails.data
                        },
                        configId: this.configId,
                        id: i.toString(),
                        productGroupCode: productData.productGroupCode
                      });
                    }
                  );

                  this.tepProductGroupMappingList$.next(
                    this.tepProductGroupMappingList
                  );
                }

                this.isGridModified = true;
              }
            });
        }
      });
  }

  removeProductGroupMapping(event: { id: string; productGroupCode: string }) {
    if (this.configId === 'NEW') {
      this.addTEPProductGroupsMapping.addProductGroups = this.addTEPProductGroupsMapping.addProductGroups.filter(
        val => val.productGroupCode !== event.productGroupCode
      );

      this.tepProductGroupMappingList = this.tepProductGroupMappingList.filter(
        val => val.productGroupCode !== event.productGroupCode
      );

      this.tepProductGroupMappingList$.next(this.tepProductGroupMappingList);
    } else {
      const removeProductGroupsMapping: AddTEPProductGroupsMapping = {
        removeProductGroups: [event.id]
      };
      this.tepProductGroupConfigFacade.saveTepProductGroupMappingDetails(
        this.configId,
        removeProductGroupsMapping
      );
      this.isGridModified = true;
    }
  }

  productGroupCodeGridSearch(event: string) {
    this.tepProductGroupConfigFacade.searchTepProductGroupMapping(
      this.configId,
      event
    );
  }
  clearGridSearch(event: boolean) {
    this.loadTepProductGroupMappingList();
  }

  openLocationMapping() {
    const configId = this.activatedRoute.snapshot.params['_id'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId,
        configType: ConfigTypeEnum.TEP_ITEM
      }
    });
  }

  editGridValue(selectedConfig: TEPProductGroupMappingGridData) {
    const dialogRef = this.dialog.open(TepProductGroupEditDialogComponent, {
      width: '800px',
      height: 'auto',
      data: selectedConfig,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((event: AddTEPProductGroupsMapping) => {
        if (event) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(take(1))
            .subscribe(result => {
              if (result) {
                this.tepProductGroupConfigFacade.saveTepProductGroupMappingDetails(
                  this.configId,
                  event
                );
                this.isGridModified = true;
              }
            });
        }
      });
  }

  openViewLocationMapping() {
    this.selectionDialog
      .open({
        title: 'Mapped Locations',
        placeholder: 'Search Location',
        options: this.mappedLocations,
        isPopupClosed: false
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
