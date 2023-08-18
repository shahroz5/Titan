import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  CustomErrors,
  OverlayNotificationType,
  ProductGroupMappingServiceAbstraction,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCConstants,
  OverlayNotificationServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import {
  getCPGProductGroupConfigForQCGCRouteUrl,
  getDetailsCPGProductGroupConfigForQCGCRouteUrl
} from '@poss-web/shared/util-site-routes';
import { CPGProductGroupForQCGCFacade } from '@poss-web/shared/cpg-qcgc-map/data-access-cpg-qcgc-map';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';

@Component({
  selector: 'poss-web-cpg-qcgc-map-details-main',
  templateUrl: './cpg-qcgc-map-details-main.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpgQcgcMapDetailsMainComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private cpgProductGroupForQCGCFacade: CPGProductGroupForQCGCFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  cpgproductGroupConfigDetails$: Observable<
    CPGProductGroupConfigForQCGCDetails
  >;

  productMappingErrorCode = ErrorEnums.ERR_PAY_009;

  selectedGroups: ProductGroupMappingOption[] = [];
  routeParam: Observable<Params>;

  showViewOnly: boolean;
  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly === 'true' ? true : false;
      });

    this.routeParam = this.activatedRoute.params;
    let param = this.activatedRoute.snapshot.params['_id'];
    this.cpgProductGroupForQCGCFacade.loadCPGProductGroupConfigDetails(param);

    if (param !== CPGProductGroupConfigForQCGCConstants.NEW) {
      this.cpgProductGroupForQCGCFacade.LoadCPGProductGroupConfigMapping(param);
    }

    this.hasError$ = this.cpgProductGroupForQCGCFacade.getError();
    this.isLoading$ = this.cpgProductGroupForQCGCFacade.getIsLoading();
    this.cpgproductGroupConfigDetails$ = this.cpgProductGroupForQCGCFacade.getCPGProductGroupConfigDetails();

    this.cpgProductGroupForQCGCFacade
      .getCPGProductGroupMapping()
      .pipe(takeUntil(this.destroy$))
      .subscribe(mapping => {
        this.selectedGroups = mapping;
      });

    this.cpgProductGroupForQCGCFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.cpgProductGroupForQCGCFacade
      .getCPGProductGroupConfigDetailsSavedResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          param = data.paymentCategoryName;
          this.showNotification(
            'pw.cpgProductGroupConfig.successMsg',
            false,
            param
          );
        }
      });

    this.cpgProductGroupForQCGCFacade
      .getCPGProductGroupConfigDetailsEditedResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification('pw.cpgProductGroupConfig.successMsg', true);
        }
      });

    this.cpgProductGroupForQCGCFacade
      .getCPGProductGroupMappingUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification(
            'pw.cpgProductGroupConfig.productroupMappingUpdated',
            false
          );
          this.cpgProductGroupForQCGCFacade.LoadCPGProductGroupConfigMapping(
            param
          );
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.productMappingErrorCode) {
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
  }

  showNotification(key: string, back: boolean, param = null) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        // type: back
        //   ? OverlayNotificationType.SIMPLE
        //   : OverlayNotificationType.TIMER,
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(() => {
            if (back) {
              if (this.selectedGroups.length === 0) {
                this.showLocMappingAlertMessage();
              } else {
                this.backArrow();
              }
            } else {
              if (param) {
                this.router.navigate([
                  getDetailsCPGProductGroupConfigForQCGCRouteUrl(),
                  param
                ]);

                this.showLocMappingAlertMessage();
              }
            }
          });
      });
  }

  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.alertPopup.selectAtleaseOneProductGroupMapping'
      })
      .pipe(take(1))
      .subscribe();
  }

  formOutput(formData: CPGProductGroupConfigForQCGCDetails) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(take(1))
      .subscribe((res: boolean) => {
        if (res) {
          if (
            this.activatedRoute.snapshot.params['_id'] ===
            CPGProductGroupConfigForQCGCConstants.NEW
          ) {
            this.cpgProductGroupForQCGCFacade.saveCPGProductGroupConfigDetails(
              formData
            );
          } else {
            this.cpgProductGroupForQCGCFacade.editCPGProductGroupConfigDetails(
              formData
            );
          }
        }
      });
  }

  openViewProductGroupMapping() {
    const selectedGroupsMapped = this.selectedGroups.map(data => {
      return {
        id: data.id,
        description: data.id
      };
    });

    this.selectionDialog
      .open({
        title: 'Mapped Product Codes',
        placeholder: 'Search Product Code',
        options: selectedGroupsMapped,
        isPopupClosed: false
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          // this.selectedLocation = selectedOption;
          // this.locationCode = selectedOption.id;
          // this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
          //   this.locationCode
          // );
        }
      });
  }
  openProductGroupMapping() {
    this.productGroupMappingServiceAbstraction
      .open({
        selectedProductGroup: this.selectedGroups
      })
      .subscribe(
        (data: {
          type: string;
          data: { addedProductGroups: any; removeProductGroups: any };
        }) => {
          if (data && data.type === 'apply') {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  const id = this.activatedRoute.snapshot.params['_id'];
                  const addProductGroups: string[] = [];
                  const removeProductGroups: string[] = [];

                  for (const addedGroups of data.data.addedProductGroups) {
                    addProductGroups.push(addedGroups.id);
                  }
                  for (const removedGroups of data.data.removeProductGroups) {
                    if (removedGroups.uuid) {
                      removeProductGroups.push(removedGroups.uuid);
                    }
                  }

                  const payload = {
                    addProductGroupCode: addProductGroups,
                    removeProductMappingIds: removeProductGroups
                  };

                  this.cpgProductGroupForQCGCFacade.saveCPGProductGroupConfigMapping(
                    payload,
                    id
                  );
                }
              });
          }
        }
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backArrow() {
    this.router.navigate([getCPGProductGroupConfigForQCGCRouteUrl()]);
  }
}
