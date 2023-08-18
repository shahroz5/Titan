import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import {
  Navigation,
  PermissionData,
  ShortcutServiceAbstraction,
  AppTypesEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ModuleNamesEnum
} from '@poss-web/shared/models';
import {
  EPOSS_APP_VERSION_NUMBER,
  POSS_APP_TYPE,
  POSS_APP_VERSION_NUMBER,
  POSS_WEB_HOST_NAME
} from '@poss-web/shared/util-config';
import { Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { FocusableTopMenuItemComponent } from '../focusable-top-menu-item/focusable-top-menu-item.component';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'poss-web-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements AfterViewInit, OnDestroy {
  @Input() notificationsCount = 0;
  @Input() sidenav: Navigation[] = [];
  @Input() username = '';
  @Input() locationCode = '';
  @Input() isHandSet = false;
  @Input() hostNameData = '';
  @Input() permissions$: Observable<any[]>;
  @Input() isBtqUser;
  @Input() fullName;

  @Output() logout = new EventEmitter();

  @ViewChild('modulesMenu') menuRef: ElementRef;

  @ViewChildren(FocusableTopMenuItemComponent)
  private focusableTopMenuItemComponents: QueryList<
    FocusableTopMenuItemComponent
  >;
  // @HostBinding() tabindex = 0;
  count = 0;
  dataList: FocusableTopMenuItemComponent[] = [];

  private noOfColumns = 3;
  selectedMenuIndex = null;

  appTypesEnum = AppTypesEnum;
  moduleNamesEnum = ModuleNamesEnum;

  destroy$ = new Subject();
  private keyManager: FocusKeyManager<FocusableTopMenuItemComponent>;

  showModulesMenu = false;

  constructor(
    private translate: TranslateService,
    public router: Router,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    public shortcutService: ShortcutServiceAbstraction,
    @Inject(POSS_WEB_HOST_NAME) public hostname,
    @Inject(POSS_APP_TYPE) public appType,
    @Inject(POSS_APP_VERSION_NUMBER) private possAppVersionNumber: string,
    @Inject(EPOSS_APP_VERSION_NUMBER) private epossAppVersionNumber: string
  ) {}

  ngAfterViewInit() {
    /**
     * FocusKeyManager configuration
     */
    this.keyManager = new FocusKeyManager(this.focusableTopMenuItemComponents)
      .withHorizontalOrientation('ltr')
      .withVerticalOrientation(false)
      .withWrap();

    this.focusableTopMenuItemComponents.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: any) => {
        if (change.length > 0) {
          this.dataList = [];

          this.count = change.length;
          this.focusableTopMenuItemComponents.forEach(result => {
            this.dataList.push(result);
          });
        }
      });
  }

  isNotificationBadgeHidden() {
    if (this.notificationsCount && this.notificationsCount > 0) {
      return false;
    } else {
      return true;
    }
  }

  toggleTheme() {
    if (document.body.classList.contains('pw-light-theme')) {
      document.body.classList.remove('pw-light-theme');
      document.body.classList.add('pw-dark-theme');
    } else {
      document.body.classList.remove('pw-dark-theme');
      document.body.classList.add('pw-light-theme');
    }
  }

  toggleShortcut() {
    this.shortcutService.shortcutEnable = !this.shortcutService.shortcutEnable;
  }

  getPermissions = (permissionData: PermissionData) => of(permissionData);

  showAboutMessage(messageKey: string, versionNumber: string) {
    this.dialog.closeAll();
    this.translate
      .get([messageKey], {
        entityName: versionNumber
      })
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        const alertMessage = translatedMsg[messageKey];

        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: alertMessage
          })
          .pipe(take(1))
          .subscribe();
      });
  }

  showAbout() {
    let messageKey: string;

    switch (this.appType) {
      case AppTypesEnum.POSS:
        messageKey = 'pw.navigation.possAppVersion';
        this.showAboutMessage(messageKey, this.possAppVersionNumber);
        break;
      default:
        messageKey = 'pw.navigation.epossAppVersion';
        this.showAboutMessage(messageKey, this.epossAppVersionNumber);
        break;
    }
  }

  selectMenu(index: number, routePath: string, external: string) {
    this.selectedMenuIndex = index;
    if (external) {
      location.href = this.hostname + '/' + routePath;
      // this.selected.emit({ routePath, appType });
    } else {
      this.router.navigate([routePath]);
    }
    if (this.showModulesMenu) this.showModulesMenu = false;
  }

  focus() {
    this.keyManager.setFirstItemActive();
  }

  scrollDown() {
    try {
      this.menuRef?.nativeElement?.scrollIntoView({
        alignToTop: true,
        behavior: 'smooth'
      });
    } catch (err) {}
  }

  toggleModulesMenu() {
    this.showModulesMenu = !this.showModulesMenu;
    if (this.showModulesMenu) {
      this.focus();
    }
  }

  /**
   * Listen to the keyDown event for FocusKeyManager
   * Used to send focus event for the card
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
    } else if (event.code !== 'ArrowDown' && event.code !== 'ArrowUp') {
      this.keyManager.onKeydown(event);
    } else {
      this.rowNavigation(event);
    }
  }

  rowNavigation(event: KeyboardEvent) {
    if (this.focusableTopMenuItemComponents.length > this.noOfColumns) {
      const totalCount = this.focusableTopMenuItemComponents.length;
      const currentIndex = this.keyManager.activeItemIndex;
      let nextIndex;
      if (event.code === 'ArrowDown') {
        nextIndex = currentIndex + this.noOfColumns;
        if (nextIndex > totalCount - 1) {
          if (
            this.count !== this.dataList.length ||
            (totalCount % this.noOfColumns &&
              totalCount - currentIndex > totalCount % this.noOfColumns)
          ) {
            nextIndex = totalCount - 1;
            this.scrollDown();
          } else {
            return;
          }
        }
      } else {
        nextIndex = currentIndex - this.noOfColumns;
        if (nextIndex < 0) {
          return;
        }
      }
      this.keyManager.setActiveItem(nextIndex);
      event.stopPropagation();
    }
  }

  @HostListener('click', ['$event'])
  private focusFirst(event: KeyboardEvent): void {
    this.focus();
  }

  /**
   * clickOutSide
   * This function will enable the user to close Main Menu overlay
   * by clicking outside the main menu overlay area.
   */
  @HostListener('body:click', ['$event'])
  clickOutside(event) {
    let element: HTMLElement = event.target as HTMLElement;
    if (
      !element.classList.contains('main-menu') &&
      event.clientX > 0 &&
      event.clientY > 0
    ) {
      if (this.showModulesMenu) this.showModulesMenu = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
