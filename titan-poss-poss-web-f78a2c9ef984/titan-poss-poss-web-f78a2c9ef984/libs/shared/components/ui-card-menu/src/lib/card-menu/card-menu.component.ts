import { FocusKeyManager } from '@angular/cdk/a11y';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CardMenu } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FocusableMenuItemComponent } from '../focusable-menu-item/focusable-menu-item.component';
import { FocusableSubMenuItemComponent } from '../focusable-sub-menu-item/focusable-sub-menu-item.component';

@Component({
  selector: 'poss-web-card-menu',
  styleUrls: ['./card-menu.component.scss'],
  templateUrl: './card-menu.component.html'
})
export class CardMenuComponent implements AfterViewInit, OnDestroy {
  @Input() title: string;
  @Input() menu: CardMenu[] = [];

  @Input() selectedMenuIndex = null;
  @Input() permissions$: Observable<any[]>;
  @Output() loadSubMenu = new EventEmitter<string>();
  @Output() menuSelected = new EventEmitter<string>();
  @Output() selected = new EventEmitter<Object>();

  @ViewChild('submenu') subMenuRef: ElementRef;

  @ViewChildren(FocusableMenuItemComponent)
  private focusableMenuItemComponents: QueryList<FocusableMenuItemComponent>;
  @ViewChildren(FocusableSubMenuItemComponent)
  private focusableSubMenuItemComponents: QueryList<
    FocusableSubMenuItemComponent
  >;

  @HostBinding() tabindex = 0;
  count = 0;

  dataList: FocusableMenuItemComponent[] = [];
  subMenuDataList: FocusableSubMenuItemComponent[] = [];

  private noOfColumns = 6;
  selectedSubMenuIndex: number;
  isFocusSet = false;
  isSubMenuFocusSet = false;
  destroy$ = new Subject();
  private keyManager: FocusKeyManager<FocusableMenuItemComponent>;
  private subMenuKeyManager: FocusKeyManager<FocusableSubMenuItemComponent>;

  constructor(
    private elementPermission: ElementPermissionService,
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService
  ) {
    const col3 = '(max-width: 992px)';
    const col2 = '(min-width: 992px)';
    this.breakpointObserver
      .observe([col3, col2])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[col2]) {
          this.noOfColumns = 6;
        } else if (state.breakpoints[col3]) {
          this.noOfColumns = 4;
        } else {
          this.noOfColumns = 6;
        }
      });
  }

  ngAfterViewInit() {
    /**
     * FocusKeyManager configuration
     */
    this.keyManager = new FocusKeyManager(this.focusableMenuItemComponents)
      .withHorizontalOrientation('ltr')
      .withVerticalOrientation(false)
      .withWrap();

    this.focusableMenuItemComponents.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: any) => {
        if (change.length > 0) {
          this.dataList = [];

          this.count = change.length;
          this.focusableMenuItemComponents.forEach(result => {
            this.dataList.push(result);
            // Do not focus 1st menu by default, if other Menu is already selected
            if (result.isSelected) {
              this.isFocusSet = true;
            }
          });

          /**
           * Set the focus to the first element,
           */
          if (!this.isFocusSet) {
            this.keyManager.setFirstItemActive();
            this.isFocusSet = true;
          } else {
            this.scrollDown();
          }
        }
      });

    this.subMenuKeyManager = new FocusKeyManager(
      this.focusableSubMenuItemComponents
    )
      .withHorizontalOrientation('ltr')
      .withVerticalOrientation(false)
      .withWrap();

    this.focusableSubMenuItemComponents.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: any) => {
        this.subMenuDataList = [];
        this.isSubMenuFocusSet = false;
        if (change.length > 0) {
          this.count = change.length;
          this.focusableSubMenuItemComponents.forEach(result => {
            this.subMenuDataList.push(result);
          });

          this.setSubMenuFocus();
        }
      });
  }

  selectMenu(
    isSubMenu: boolean,
    index: number,
    hasChild: boolean,
    routePath: string,
    appType: string,
    menuKey: string = null
  ) {
    if (!isSubMenu) {
      this.selectedMenuIndex = index;
    } else {
      this.selectedSubMenuIndex = index;
    }

    if (hasChild) {
      if (!isSubMenu) {
        this.selectedMenuIndex = index;
        this.menuSelected.emit(menuKey);

        this.subMenuDataList = [];
        this.isSubMenuFocusSet = false;

        if (this.focusableSubMenuItemComponents?.length > 0) {
          this.focusableSubMenuItemComponents.forEach(result => {
            this.subMenuDataList.push(result);
          });

          this.setSubMenuFocus();
        }
        setTimeout(() => {
          this.scrollDown();
        }, 200);
      } else {
        this.selectedSubMenuIndex = index;
        this.loadSubMenu.emit(
          this.menu[this.selectedMenuIndex].child[index].subMenuPath
        );
      }
    } else {
      this.subMenuDataList = [];
      if (routePath) {
        this.selected.emit({ routePath, appType });
      }
    }
  }

  setSubMenuFocus() {
    /**
     * Set the focus to the first element,
     */
    if (!this.isSubMenuFocusSet) {
      this.subMenuKeyManager.setFirstItemActive();
      this.isSubMenuFocusSet = true;
    } else {
      this.scrollDown();
    }
  }

  focus() {
    if (this.isFocusSet && this.subMenuDataList.length > 0) {
      this.subMenuKeyManager.setFirstItemActive();
    } else {
      this.keyManager.setFirstItemActive();
    }
  }

  /**
   * Reset focus key to set the focus to the first element
   */
  resetFocus() {
    this.isFocusSet = false;
    this.isSubMenuFocusSet = false;
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  scrollDown() {
    try {
      this.subMenuRef?.nativeElement?.scrollIntoView({
        alignToTop: true,
        behavior: 'smooth'
      });
    } catch (err) {}
  }

  /**
   * Listen to the keyDown event for FocusKeyManager
   * Used to send focus event for the card
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.code === 'Escape' && this.subMenuDataList.length > 0) {
      this.subMenuDataList = [];
      this.isSubMenuFocusSet = false;
      //Set focus to Current active item
      this.keyManager.setActiveItem(this.keyManager.activeItemIndex);
    } else if (event.code !== 'ArrowDown' && event.code !== 'ArrowUp') {
      if (this.subMenuDataList.length > 0) {
        this.subMenuKeyManager.onKeydown(event);
      } else {
        this.keyManager.onKeydown(event);
      }
    } else {
      this.rowNavigation(event);
    }
  }

  rowNavigation(event: KeyboardEvent) {
    if (
      this.subMenuDataList.length > 0 &&
      this.subMenuDataList.length > this.noOfColumns
    ) {
      const totalCount = this.focusableSubMenuItemComponents.length;
      const currentIndex = this.subMenuKeyManager.activeItemIndex;
      let nextIndex;
      if (event.code === 'ArrowDown') {
        nextIndex = currentIndex + this.noOfColumns;
        if (nextIndex > totalCount - 1) {
          if (
            this.count !== this.subMenuDataList.length ||
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
      this.subMenuKeyManager.setActiveItem(nextIndex);
      event.stopPropagation();
    } else if (this.focusableMenuItemComponents.length > this.noOfColumns) {
      const totalCount = this.focusableMenuItemComponents.length;
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

  @HostListener('focus', ['$event'])
  private focusFirst(event: KeyboardEvent): void {
    this.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
