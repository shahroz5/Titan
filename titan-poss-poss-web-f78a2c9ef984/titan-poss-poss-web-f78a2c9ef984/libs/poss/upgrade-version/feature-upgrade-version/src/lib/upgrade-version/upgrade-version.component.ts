import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PossHomeKeyEnum,
  UpgradeVersion,
  UpgradeVersionResponse
} from '@poss-web/shared/models';
import { UpgradeVersionFacade } from 'libs/poss/upgrade-version/data-access-upgrade-version/src/lib/+state/upgrade-version.facade';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-upgrade-version',
  templateUrl: './upgrade-version.component.html',
  styleUrls: ['./upgrade-version.component.scss']
})
export class UpgradeVersionComponent implements OnInit {
  destroy$ = new Subject();
  isLoading$: Observable<boolean>;
  upgradeVersionData: UpgradeVersion;
  isUpgradeAvailable: boolean;
  upgradeVersionSucessResponse: UpgradeVersionResponse;

  constructor(
    public translate: TranslateService,
    private upgradeVersionFacade: UpgradeVersionFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.upgradeVersionFacade.loadIsUpgradeAvailable();
    this.isLoading$ = this.upgradeVersionFacade.getIsLoading();
    this.upgradeVersionFacade
      .getIsUpgradeAvailable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: UpgradeVersion) => {
        if (data) {
          this.upgradeVersionData = data[0];
          this.isUpgradeAvailable = this.upgradeVersionData.upgradeAvailable;
        }
      });
    this.upgradeVersionFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  openDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.upgradeVersion.alertText'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.upgradeVersionFacade.sendRequestForUpgrade();
          this.openInstructionDialog();
        }
      });
  }

  openInstructionDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.upgradeVersion.confirmAlertText'
      })
      .pipe(take(1))
      .subscribe();
  }

  back() {
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.UPGRADE_VERSION
      }
    });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
