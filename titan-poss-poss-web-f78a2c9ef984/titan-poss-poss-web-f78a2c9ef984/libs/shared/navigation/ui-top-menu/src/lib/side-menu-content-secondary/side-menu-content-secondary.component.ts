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
} from '@poss-web/shared/models';
import {
  POSS_APP_TYPE,
  POSS_WEB_HOST_NAME
} from '@poss-web/shared/util-config';
import { Router } from '@angular/router';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-side-menu-content-secondary',
  templateUrl: './side-menu-content-secondary.component.html',
  styleUrls: ['./side-menu-content-secondary.component.scss']
})
export class SideMenuContentSecondaryComponent implements OnInit {
  @Input() notificationsCount = 0;
  @Input() showSideMenu = false;
  @Input() showTopMenu = true;
  @Input() userName = '';
  @Input() locationCode = '';
  @Input() hostName = '';
  @Input() isBtqUser = false;
  @Input() fullName = '';
  @Input() businessDay: number;
  @Input() bodStatus: string;
  @Input() metals: any;
  @Input() currencyCode: string;
  @Input() hideToolbar: boolean;
  @Input() isCorpUser: boolean;

  @Output() logOut = new EventEmitter();
  appTypesEnum = AppTypesEnum;
  bodEodStatusEnum = BodEodStatusEnum;

  isHandset$: Observable<boolean>;
  isLightTheme = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    @Inject(POSS_WEB_HOST_NAME) public domainhostname,
    @Inject(POSS_APP_TYPE) public appType
  ) {}

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
  }

  dateFormat(date) {
    return moment(Number(date));
  }
}
