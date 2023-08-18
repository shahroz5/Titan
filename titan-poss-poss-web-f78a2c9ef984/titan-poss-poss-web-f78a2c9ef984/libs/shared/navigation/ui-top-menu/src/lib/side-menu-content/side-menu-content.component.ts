import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Inject
} from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {
  AppTypesEnum,
  BodEodStatusEnum,
  Navigation
} from '@poss-web/shared/models';
import {
  POSS_APP_TYPE,
  POSS_WEB_HOST_NAME
} from '@poss-web/shared/util-config';
import { Router } from '@angular/router';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'poss-web-side-menu-content',
  templateUrl: './side-menu-content.component.html',
  styleUrls: ['./side-menu-content.component.scss']
})
export class SideMenuContentComponent implements OnInit {
  @Input() notificationsCount = 0;
  @Input() showSideMenu = false;
  @Input() showTopMenu = true;
  @Input() userName = '';
  @Input() locationCode = '';
  @Input() sideNav: Navigation[] = [];
  @Input() hostName = '';
  @Input() permissions$: Observable<any[]>;
  @Input() isBtqUser = false;
  @Input() fullName = '';
  isLightTheme = true;
  @Input() businessDay: number;
  @Input() bodStatus: string;
  @Input() metals: any;
  @Input() currencyCode: string;
  @Input() hideToolbar: boolean;
  @Input() isCorpUser: boolean;

  @Output() sideNavToggle = new EventEmitter();
  @Output() logOut = new EventEmitter();
  appTypesEnum = AppTypesEnum;
  bodEodStatusEnum = BodEodStatusEnum;

  isHandset$: Observable<boolean>;
  status = 'ONLINE';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    @Inject(POSS_WEB_HOST_NAME) public domainhostname,
    @Inject(POSS_APP_TYPE) public appType,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      if (isConnected?.hasNetworkConnection) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }

      this.sideNav = this.sideNav.filter(
        eachVal => eachVal?.isOffline !== this.status
      );
    });
  }

  ngOnInit() {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small])
      .pipe(map(result => result.matches));

    if (document.body.classList.contains('pw-light-theme')) {
      this.isLightTheme = true;
    } else {
      this.isLightTheme = false;
    }
  }
  goToAppHome() {
    this.router.navigate([getPossHomeRouteUrl()]);
    // if (this.appType === 'EPOSS') {
    //   this.router.navigate([getInventoryHomeRouteUrl()]);
    // } else if (this.appType === 'POSS') {
    //   this.router.navigate([getPossHomeRouteUrl()]);
    // }
  }

  dateFormat(date) {
    return moment(Number(date));
  }
}
