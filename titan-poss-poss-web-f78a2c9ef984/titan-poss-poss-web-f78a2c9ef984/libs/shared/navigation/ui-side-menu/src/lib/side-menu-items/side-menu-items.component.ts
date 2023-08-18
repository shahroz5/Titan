import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChildren,
  QueryList,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject
} from '@angular/core';

import { Navigation, PermissionData } from '@poss-web/shared/models';
import { MenuItemComponent } from '../menu-item.component';
import { SubMenuComponent } from '../sub-menu/sub-menu.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { POSS_WEB_HOST_NAME } from '@poss-web/shared/util-config';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'poss-web-side-menu-items',
  templateUrl: './side-menu-items.component.html',
  styleUrls: ['./side-menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuItemsComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() menuData: Navigation[] = [];
  @Input() searchValue = '';
  @Input() focusEvent: Subject<KeyboardEvent>;

  @Output() sideNavToggle = new EventEmitter();

  @ViewChildren('queryItem')
  menuItems: QueryList<MenuItemComponent | SubMenuComponent>;

  menuItemsArray: MenuItemComponent[] = [];
  keyManager: FocusKeyManager<MenuItemComponent>;
  quickLinks: Navigation[] = [];
  destroy$: Subject<null> = new Subject<null>();
  status = 'ONLINE';

  constructor(
    private translate: TranslateService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    @Inject(POSS_WEB_HOST_NAME) public hostname,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      if (isConnected?.hasNetworkConnection) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e: NavigationStart) => e instanceof NavigationStart)
      )
      .subscribe(e => {
        // this.quickLinks = [];
        this.deepQuickLinksSearch(this.menuData, e.url);
        this.changeDetector.markForCheck();
      });

    this.focusEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => this.keyManager.onKeydown(event));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['menuData'] &&
      changes['menuData'].currentValue &&
      !this.searchValue
    ) {
      if (this.menuData.length > 0) {
        this.menuData = this.menuData.filter(
          eachVal => eachVal?.isOffline !== this.status
        );
      }
      // this.quickLinks = [];
      this.deepQuickLinksSearch(this.menuData, this.router.url);
    }

    if (this.searchValue) {
      this.quickLinks = [];
    }
  }

  ngAfterViewInit() {
    this.menuItems.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.menuItemsArray = [];
      this.menuItems
        .toArray()
        .forEach(el =>
          el instanceof MenuItemComponent
            ? this.menuItemsArray.push(el)
            : this.fetchMenuItems(el)
        );

      this.keyManager = new FocusKeyManager<MenuItemComponent>(
        this.menuItemsArray
      )
        .withVerticalOrientation(true)
        .withWrap();
    });
  }

  fetchMenuItems = (element: SubMenuComponent) =>
    element.menuItems
      .toArray()
      .forEach(item =>
        item instanceof MenuItemComponent
          ? this.menuItemsArray.push(item)
          : this.fetchMenuItems(item)
      );

  deepQuickLinksSearch(menuItems: Navigation[], url: string) {
    if (!!menuItems) {
      menuItems.forEach(token =>
        token && '/' + token.url === url
          ? this.getAllQuickLinks(token)
          : this.deepQuickLinksSearch(token.children, url)
      );
    }
  }

  getAllQuickLinks(token) {
    this.quickLinks = [];
    if (token.children && token.children.length > 0) {
      token.children.forEach(child => {
        this.quickLinks.push(child);
      });
    }
    if (token.quickLinks && token.quickLinks.length > 0) {
      token.quickLinks.forEach(quickLink => {
        this.quickLinks.push(quickLink);
      });
    }
    return this.quickLinks;
  }

  getPermissions = (permissionData: PermissionData) => of(permissionData);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
