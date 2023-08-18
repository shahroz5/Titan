import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  getFocConfigurationListRouteUrl,
  getFocConfigurationVariantDetailsRouteUrl,
  getFocConfigurationRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import { FocConfigurationFacade } from '@poss-web/eposs/foc-config/data-access-foc-config';
import {
  SchemeDetails,
  focSchemeBasedEnums,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomErrors,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-foc-config-detail',
  templateUrl: './foc-config-detail.component.html',
  styleUrls: ['./foc-config-detail.component.scss']
})
export class FocConfigDetailComponent implements OnInit {
  isLoading$: Observable<boolean>;
  selectedTab = 0;

  configId: string;
  rangeWeight: string[];
  schemeDetails$: Observable<SchemeDetails>;
  schemeDetails: SchemeDetails;
  tepDetails = [];
  destroy$ = new Subject<null>();
  showViewOnly = true;

  constructor(
    private router: Router,
    private translate: TranslateService,
    public focConfigurationFacade: FocConfigurationFacade,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.focConfigurationFacade.loadReset();
    this.isLoading$ = this.focConfigurationFacade.getIsloading();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];

        if (this.configId !== focSchemeBasedEnums.NEW) {
          this.focConfigurationFacade.loadFocSchemeConfigurationByConfigId(
            this.configId
          );
        }
      });
    this.focConfigurationFacade.loadRangeWeight();
    this.focConfigurationFacade
      .getRangeWeight()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const array = [];
        if (data) {
          for (const dataItem of data) {
            array.push(dataItem);
          }
        }

        this.rangeWeight = array;
      });

    this.focConfigurationFacade
      .getSchemeDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.getSchemeDetails(data);
          this.saveSuccessMessageNotification(
            data.id,
            'pw.focConfiguration.successMsg'
          );
        }
      });
    this.focConfigurationFacade
      .getSchemeDetailsById()
      .pipe(takeUntil(this.destroy$))
      .subscribe((schemeDetailsById: SchemeDetails) => {
        if (schemeDetailsById) this.getSchemeDetails(schemeDetailsById);
      });

    this.focConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          if (this.configId !== focSchemeBasedEnums.NEW) {
            this.focConfigurationFacade.loadFocSchemeConfigurationByConfigId(
              this.configId
            );
          }

          this.showSuccessMessageNotification('pw.focConfiguration.updatedMsg');
        }
      });

    this.focConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  getSchemeDetails(data) {
    const schemeDetails: SchemeDetails = {
      id: data?.id,
      isActive: data?.isActive,
      isAccrualUlp: data?.isAccrualUlp,
      tepConfigData: data?.tepConfigData,
      grnConfigData: data?.grnConfigData,
      clubbingConfigData: data?.clubbingConfigData,
      orderConfigData: data?.orderConfigData,
      name: data?.name,
      description: data?.description
    };
    this.schemeDetails = schemeDetails;

    this.tepDetails = [];
    for (const tepArray of data?.tepConfigData?.data?.tepDetails) {
      this.tepDetails.push({
        durationInDays: tepArray?.durationInDays,
        recoveryPercent: tepArray?.recoveryPercent,
        isSaved: true
      });
    }
  }

  changeTab(tab) {
    this.selectedTab = tab;
    if (this.selectedTab === 1) {
      this.router.navigate([
        getFocConfigurationVariantDetailsRouteUrl(this.configId)
      ]);
    }
  }
  back() {
    this.router.navigate([getFocConfigurationListRouteUrl()]);
    this.focConfigurationFacade.loadReset();
  }

  saveFocSchemeDetails(saveSchemeDetails: SchemeDetails) {
    if (
      this.configId !== focSchemeBasedEnums.NEW &&
      !this.schemeDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.configId === focSchemeBasedEnums.NEW) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.focConfigurationFacade.saveFocSchemeConfiguration(
                saveSchemeDetails
              );
            }
          });
      } else if (this.configId !== focSchemeBasedEnums.NEW) {
        saveSchemeDetails.id = this.configId;
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.focConfigurationFacade.updateFocSchemeConfiguration(
                saveSchemeDetails
              );
            }
          });
      }
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  saveSuccessMessageNotification(id: string, key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.router.navigate([getFocConfigurationRouteUrl() + '/' + id]);
          });
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
}
