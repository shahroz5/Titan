import { ScrollService } from '@poss-web/shared/util-common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  Inject,
  HostListener
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, filter, withLatestFrom, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  Navigation,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  ShortcutServiceAbstraction,
  Command,
  CustomErrors,
  ToolbarConfig,
  LocationSettingAttributesEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  AppTypesEnum,
  EmployeeSignatureDetailsResponse,
  SubBrandTypeEnum
} from '@poss-web/shared/models';
import { SidenavService } from '@poss-web/shared/navigation/data-access-navigation';
import { SideMenuComponent } from '@poss-web/shared/navigation/ui-side-menu';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
// import { SseNotificationsFacade } from '@poss-web/shared/sse-notifications/data-access-sse-notifications';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { SSENotificationService } from '@poss-web/shared/notifications/data-access-notifications';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING,
  POSS_WEB_REFRESH_CHECK_SETTING,
  POSS_APP_TYPE,
  POSS_WEB_HOST_NAME,
  POSS_APP_VERSION_NUMBER,
  EPOSS_APP_VERSION_NUMBER
} from '@poss-web/shared/util-config';
import { LocalStorageService } from '@poss-web/shared/util-cacheable-api-service';
import {
  epossLoginPageUrl,
  loginUrl,
  possLoginPageUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';

const NAVIGATION_TOGGLE = 'Global.NAVIGATION_TOGGLE';
const searchShortcutKey = 'NavigationComponent.MAIN_SEARCH';

/**
 * This Component is the root component for logged-in users and act as container for Poss & Eposs applications irrespective of BOD/EOD Status
 */

@Component({
  selector: 'poss-web-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  username$: Observable<string>;
  sidenav$: Observable<Navigation[]>;
  permissionData: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  isAclLoading$: Observable<boolean>;
  hostName$: Observable<string>;
  locationCode$: Observable<string>;
  permissions$: Observable<any[]>;
  notifications = [];
  notificationsCount = 0;
  notificationsList = [];
  isBtqUser$: Observable<boolean>;
  fullName$: Observable<string>;
  businessDay: number;
  bodStatus: string;
  metals: any;
  currencyCode: string;
  hideToolbar = false;
  isCorpUser: boolean;
  showRefreshAlertMessage: Observable<boolean>;
  @Input() isSecondaryLayout = false;
  refreshCheckNotificationSubscription: Subscription;
  refreshCheckSubscription: Subscription;
  timersArray: number[] = [];
  isSideNavOpened = false;

  @ViewChild('sidenav') private sidenavElement: MatSidenav;
  @ViewChild(SideMenuComponent)
  private menuRef: SideMenuComponent;

  @ViewChild(MatSidenavContent)
  private matSidenavContentRef: MatSidenavContent;

  tabWasClosed = false;

  constructor(
    private authFacade: AuthFacade,
    private service: SidenavService,
    private notification: OverlayNotificationServiceAbstraction,
    private router: Router,
    public dialog: MatDialog,
    private shortcutService: ShortcutServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private profileDataFacade: ProfileDataFacade,
    private permissionFacade: PermissionFacade,
    private translate: TranslateService,
    // private notificationFacade: SseNotificationsFacade
    private notificationService: SSENotificationService,
    private scrollService: ScrollService,
    private toolbarFacade: ToolbarFacade,
    private bodEodFacade: SharedBodEodFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private localStorageService: LocalStorageService,
    @Inject(POSS_WEB_REFRESH_CHECK_SETTING)
    private refreshCheckSettings: number,
    @Inject(POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING)
    private refreshCheckNotificationSettings: number,
    @Inject(POSS_WEB_HOST_NAME) private domainhostname,
    @Inject(POSS_APP_TYPE) private appType,
    @Inject(POSS_APP_VERSION_NUMBER) public possAppVersionNumber: string,
    @Inject(EPOSS_APP_VERSION_NUMBER) public epossAppVersionNumber: string
  ) {}

  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event) {
  //   this.logOut();
  // }

  doBeforeUnload() {
    this.authFacade.logOut();
  }

  doUnload() {
    this.doBeforeUnload();
  }

  scrollEvent() {
    this.scrollService.setScrollTop(
      this.matSidenavContentRef.measureScrollOffset('top')
    );
  }

  ngOnInit() {
    this.sidenav$ = this.service.getdata();
    this.username$ = this.authFacade.getUserName();
    this.isLoading$ = this.authFacade.isLoading();
    this.hostName$ = this.appsettingFacade.getHostName();
    this.locationCode$ = this.profileDataFacade.getBoutiqueCode();
    this.isAclLoading$ = this.permissionFacade.isLoading();
    this.permissions$ = this.permissionFacade.getPermissionforURL();
    this.isBtqUser$ = this.profileDataFacade.isBTQUser();
    this.fullName$ = this.profileDataFacade.getEmpName();

    this.authFacade
      .getUserName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userName: string) => {
        if (userName) {
          this.checkIfUserIsCashier(userName);
        }
      });

    this.profileDataFacade
      .getEmployeeSignatureDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (employeeSignatureDetails: EmployeeSignatureDetailsResponse) => {
          if (
            employeeSignatureDetails &&
            !employeeSignatureDetails.digitalSignature &&
            !this.router.url.includes('user-profile') &&
            // !this.router.url.includes('eposs') &&
            this.appType === AppTypesEnum.POSS
          ) {
            this.showAlertPopUp(
              'Signature is not available. Please register your signature.'
            );
          }
        }
      );

    this.authFacade
      .getRefreshNotificationStatus()
      .pipe(
        filter(status => !!status),
        withLatestFrom(this.authFacade.getExpTime()),
        takeUntil(this.destroy$)
      )
      .subscribe(([status, expTime]) => {
        if (!!status && !!expTime) {
          this.dialog.closeAll();

          const expireInMinutes = Math.round(
            (expTime.getTime() -
              this.refreshCheckSettings * 60000 -
              new Date().getTime()) /
              60000
          );

          let alertMessage: string;
          if (expireInMinutes > 0) {
            this.translate
              .get(['pw.navigation.sessionTokenExpiryMessage'], {
                entityName: expireInMinutes
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((translatedMsg: any) => {
                alertMessage =
                  translatedMsg['pw.navigation.sessionTokenExpiryMessage'];
              });

            // alertMessage = `Session token is about to expire, please save your work. Page will get reloaded in ${expireInMinutes} minutes`;

            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.INFO,
                message: alertMessage
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  this.authFacade.hideRefreshNotificationStatus();
                }
              });
          }
        }
      });

    const toolbarData: ToolbarConfig = {
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);

    this.toolbarFacade
      .getToolbarConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe((toolbarConfig: ToolbarConfig) => {
        if (toolbarConfig) {
          if (toolbarConfig.txnType && toolbarConfig.subTxnType) {
            this.hideToolbar = true;
          } else {
            this.toolbarFacade.loadMetalPriceDetails();
            this.hideToolbar = false;
          }
        } else {
          this.toolbarFacade.loadMetalPriceDetails();
          this.hideToolbar = false;
        }
      });

    this.profileDataFacade
      .isBTQUser()
      .pipe(
        filter(isBTQUser => isBTQUser !== null),
        take(1)
      )
      .subscribe(isBTQUser => {
        if (isBTQUser) {
          this.bodEodFacade.loadLatestBusinessDay();
          // this.toolbarFacade.loadMetalPriceDetails();
        }
      });

    this.bodEodFacade
      .getLatestBusinessDate()
      .pipe(
        filter(date => date !== -1),
        takeUntil(this.destroy$)
      )
      .subscribe((date: number) => {
        if (date) {
          this.businessDay = date;
        }
      });

    this.bodEodFacade
      .getBodEodStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(bodEodStatus => {
        this.bodStatus = bodEodStatus;
      });

    this.toolbarFacade
      .getMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(priceDetails => {
        if (priceDetails) {
          this.metals = priceDetails;
        }
      });

    this.profileDataFacade
      .isCorpUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        this.isCorpUser = val1;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_SUB_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(subBrandCode => {
        if (
          subBrandCode &&
          subBrandCode.toUpperCase() === SubBrandTypeEnum.MIA
        ) {
          document.body.classList.remove('pw-light-theme');
          document.body.classList.remove('pw-zoya-theme');
          document.body.classList.add('pw-dark-theme');
        } else if (
          subBrandCode &&
          subBrandCode.toUpperCase() === SubBrandTypeEnum.ZOYA
        ) {
          document.body.classList.remove('pw-light-theme');
          document.body.classList.remove('pw-dark-theme');
          document.body.classList.add('pw-zoya-theme');
        } else {
          document.body.classList.remove('pw-dark-theme');
          document.body.classList.remove('pw-zoya-theme');
          document.body.classList.add('pw-light-theme');
        }
      });

    this.permissionFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(error => !!error)
      )
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.authFacade
      .getLoginError()
      .pipe(
        takeUntil(this.destroy$),
        filter(error => !!error)
      )
      .subscribe(error =>
        this.notification.show({
          type: OverlayNotificationType.ERROR,
          error: error,
          hasClose: true
        })
      );

    // Logout User when Profile Api fails
    this.profileDataFacade
      .getError()
      .pipe(
        filter(error => error !== null),
        take(1)
      )
      .subscribe(error => {
        console.log('Error in User Profile, logout user:', error);
        this.logOut();
      });

    //Logout from Sso, when logged-in via Sso & User logout from App
    this.authFacade
      .getSsoLogoutUrl()
      .pipe(
        filter(ssoLogoutUrl => ssoLogoutUrl && ssoLogoutUrl.length > 0),
        take(1)
      )
      .subscribe(ssoLogoutUrl => {
        if (ssoLogoutUrl) {
          // window.open(ssoLogoutUrl, '_blank');
          // this.authFacade.logoutFromSso(ssoLogoutUrl);
          this.authFacade.clearSsoLogoutUrl();
        }
      });

    this.authFacade
      .isUserLoggedOut()
      .pipe(
        filter(status => status === true),
        withLatestFrom(this.profileDataFacade.isBTQUser()),
        takeUntil(this.destroy$)
      )
      .subscribe(([status, isBTQUser]) => {
        this.clearTimerSubscription();

        if (!isBTQUser && this.appType === AppTypesEnum.POSS) {
          window.location.href = this.domainhostname + epossLoginPageUrl();
        } else if (!!isBTQUser && this.appType === AppTypesEnum.EPOSS) {
          window.location.href = this.domainhostname + possLoginPageUrl();
        } else {
          this.router.navigate([loginUrl()]);
        }
      });

    this.authFacade
      .getAccessToken()
      .pipe(
        filter(token => !!token),
        withLatestFrom(
          this.authFacade.getExpTime(),
          this.authFacade.getRefreshToken()
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([token, expTime, refreshToken]) => {
        this.clearTimerSubscription();

        this.refreshCheckNotificationSubscription = this.onTimer(
          'refreshCheckNotification',
          expTime.getTime() -
            this.refreshCheckNotificationSettings * 60000 -
            new Date().getTime()
        ).subscribe(_ => {
          this.authFacade.showRefreshNotification();
        });

        this.refreshCheckSubscription = this.onTimer(
          'refreshCheck',
          expTime.getTime() -
            this.refreshCheckSettings * 60000 -
            new Date().getTime()
        ).subscribe(_ => {
          this.authFacade.refresh(refreshToken);
        });
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    this.notificationService
      .getAllNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications: any[]) => {
        this.notificationsCount = notifications.length;
      });
    // ###################################################3
    // this.notificationFacade.loadNotification();
    // this.notificationFacade
    //   .getNotification()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(notification => {
    //     if (notification) {
    //       // const notificationData = JSON.parse(notification.data);
    //       const notificationData = notification.data;
    //       this.notifications = [...this.notificationsList, notificationData];
    //       this.notificationFacade.loadNotificationsList(this.notifications);
    //       this.notificationFacade.loadNotificationsCount(
    //         this.notifications.length
    //       );
    //       //this.notifications.push(notificationData);
    //     }
    //   });

    // this.notificationFacade
    //   .getNotificationsCount()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(notificationsCount => {
    //     this.notificationsCount = notificationsCount;
    //   });

    // this.notificationFacade
    //   .getNotificationsList()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((notificationsList: any[]) => {
    //     this.notificationsList = notificationsList;
    //   });

    // ###################################################3

    // Commented following code for SSE notifications - Need to implement service integration
    // 'http://localhost:3000/stream'
    // this.authFacade.getAccessToken().subscribe(
    //   accessToken => {
    //     console.log('Access token in navigation :', accessToken);
    //     this.getEventsFromServer(`Bearer ${accessToken}`);
    //   }
    // );
  }

  onClose(): void {
    this.isSideNavOpened = false;
  }
  closeSideNav() {
    this.sidenavElement.close();
    this.isSideNavOpened = false;
  }
  sideNavToggle() {
    this.sidenavElement.toggle();
    this.isSideNavOpened = !this.isSideNavOpened;
  }

  onTimer(requestFrom: string, value): Observable<any> {
    const timer$ = new Observable(observer => {
      const id = setTimeout(() => observer.next(1), value);

      // this.localStorageService.setCache(requestFrom, id);
      this.timersArray.push(id);

      return () => {
        clearTimeout(id);
      };
    });
    return timer$;
  }

  clearTimerSubscription() {
    for (let i = 0; i < this.timersArray.length; i++) {
      clearTimeout(this.timersArray[i]);
    }

    if (!!this.refreshCheckNotificationSubscription) {
      this.refreshCheckNotificationSubscription.unsubscribe();
    }
    if (!!this.refreshCheckSubscription) {
      this.refreshCheckSubscription.unsubscribe();
    }
  }

  // Commented following code for SSE notifications - Need to implement service integration
  // getEventsFromServer(accessToken: any) {
  //   // return this.service.getEventsFromServer('', accessToken);
  //   console.log('I AM IN GETEVENTSFROMSERVER ' + Math.random());
  //   this.service
  //     .getEventsFromServer('', accessToken)
  //     .subscribe((data: MessageEvent) => {
  //       console.log('data from server', data);
  //       const notificationData = JSON.parse(data.data);
  //       this.notifications = [...this.notifications, notificationData];
  //       //this.notifications.push(notificationData);
  //       console.log('Notification in navigation :', this.notifications);
  //     });
  // }

  logOut() {
    this.authFacade.logOut();
  }

  /**
   * method to handle shortcut commands;
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchShortcutKey: {
        this.menuRef.inputRef.nativeElement.focus();
        break;
      }
      case NAVIGATION_TOGGLE: {
        this.dialog.closeAll();
        // this.sidenavElement.toggle();
        this.sideNavToggle();
        break;
      }
    }
  }

  checkIfUserIsCashier(employeeCode: string) {
    this.profileDataFacade
      .getUserRoles()
      .pipe(
        filter(
          userRoles =>
            userRoles && userRoles.length && userRoles.includes('CASHIER')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((userRoles: string[]) => {
        console.log('USER ROLES :', userRoles);
        console.log('APPTYPE :', this.appType);
        if (
          this.appType === AppTypesEnum.POSS
          // &&
          // !this.router.url.includes('eposs')
        ) {
          this.profileDataFacade.loadEmployeeSignatureDetails(employeeCode);
        }
      });
  }

  showAlertPopUp(message: string) {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.router.navigate(['user-profile']);
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.notification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.clearTimerSubscription();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
