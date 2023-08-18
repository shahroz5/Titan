import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';

import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { AppSettingService } from '@poss-web/shared/appsetting/feature-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { LocationSettingsFeatureService } from '@poss-web/shared/location-settings/feature-location-settings';
import { filter, takeUntil } from 'rxjs/operators';
import { ProfileFeatureService } from '@poss-web/shared/profile/feature-profile';
import { SharedBodEodFeatureServiceAbstraction } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  loginStatus$: Observable<boolean>;
  bodStatus = false;
  isPrimaryLayout = false;
  title: string;
  blockCopyPasteValue$: Observable<boolean>;
  destroy$ = new Subject();
  isLoading$: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private appSetting: AppSettingService,
    private appTitle: Title,
    private locationSettingsFeatureService: LocationSettingsFeatureService,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private profileFeatureService: ProfileFeatureService
  ) {
    //[TODO: Application Title Should come from the resource file]
    appTitle.setTitle('POSS - Boutique Point Of Sale');
    this.title = appTitle.getTitle();
    // const possTitle = 'pw.global.possTitle';
    // translate
    //   .get([possTitle])
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((translatedMsg: any) => {
    //     appTitle.setTitle(translatedMsg[possTitle]);

    //   });
  }

  ngOnInit(): void {
    this.isLoading$ = this.bodEodFeatureService.getIsLoading();
    this.locationSettingsFeatureService.loadLocationSettings();
    this.loginStatus$ = this.authService.isUserLoggedIn();
    this.appSetting
      .getLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.translate.use(lang));

    this.blockCopyPasteValue$ = this.appSetting.getBlockCopyPasteSetting();

    this.authService
      .getAccessToken()
      .pipe(
        filter(accessToken => accessToken && accessToken.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe(accessToken => {
        if (accessToken) {
          this.profileFeatureService
            .isBTQUser()
            .pipe(
              filter(isBTQUser => isBTQUser !== null),
              takeUntil(this.destroy$)
            )
            .subscribe(isBTQUser => {
              if (isBTQUser) {
                this.appTitle.setTitle('POSS - Boutique Point Of Sale');
                this.title = this.appTitle.getTitle();
              } else {
                this.appTitle.setTitle('EPOSS - Central Point Of Sale');
                this.title = this.appTitle.getTitle();
              }
            });
          // Action to call OPEN business date to deciding the layout
          this.bodEodFeatureService.loadCurrentDayBodStatus();

          // To get Open Business date & Gold rates for deciding the Layout
          combineLatest([
            this.bodEodFeatureService
              .getBusinessDayDateForGuard()
              .pipe(filter(businessDate => businessDate !== -1)),
            this.bodEodFeatureService.getGoldRateAvailablityStatus()
          ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([businessDate, goldRateAvailable]) => {
              this.isPrimaryLayout = false;
              if (!!businessDate) {
                if (!goldRateAvailable) {
                  this.bodEodFeatureService.loadMetalRatesForBusinessDay(
                    businessDate
                  );
                } else {
                  this.isPrimaryLayout = true;
                }
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
