import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Navigation } from '@poss-web/shared/models';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'poss-web-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent implements OnInit, OnDestroy {
  @Input() sidenavData: Navigation[] = [];
  @Input() username = '';

  @Output() sideNavToggle = new EventEmitter();
  @Output() logout = new EventEmitter();

  @ViewChild('searchBox', { static: true }) inputRef: ElementRef;

  private regExp: RegExp = new RegExp('\\s');

  searchFormControl = new FormControl();
  sidenavSearch: Navigation[] = [];
  focusEvent: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
  destroy$: Subject<null> = new Subject<null>();
  noSearchResults: boolean;
  noDataFoundMessage: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private permissionService: PermissionService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.resultEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.resultEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a, b) => a.trim() === b.trim()),
        debounceTime(1000)
      )
      .subscribe((event: any) => {
        this.searchFormControl.patchValue(event);
        this.sidenavSearch = [];
        this.noSearchResults = false;
        if (this.searchFormControl.value.length > 0) {
          this.sidenavData.forEach(menuitem => {
            const tempMenuItem = { ...menuitem };
            if (this.searchSideMenuItems(tempMenuItem)) {
              //To know if its the exact match
              const tempMenuItemWithExactMatchFlag = this.getExactMatchStatus(
                this.searchFormControl.value,
                tempMenuItem
              );

              this.sidenavSearch.push(tempMenuItemWithExactMatchFlag);
            }
          });
        }

        if (this.sidenavSearch.length > 0) {
          this.noSearchResults = false;
        } else if (
          this.sidenavSearch.length === 0 &&
          this.searchFormControl.value.length !== 0
        ) {
          this.noSearchResults = true;
        }
        this.changeDetector.markForCheck();
      });
  }

  getExactMatchStatus(
    searchInputValue: string,
    menuItem: Navigation
  ): Navigation {
    let menuItemWithExactMatchFlag: Navigation;

    if (searchInputValue && menuItem && menuItem.name) {
      const userInput = searchInputValue.toLowerCase().trim();
      const matched = userInput.localeCompare(menuItem.name.toLowerCase());

      if (matched === 0) {
        menuItemWithExactMatchFlag = {
          ...menuItem,
          isExactMatchForSearchInput: true
        };
      } else {
        menuItemWithExactMatchFlag = {
          ...menuItem,
          isExactMatchForSearchInput: false
        };
      }

      return menuItemWithExactMatchFlag;
    }
  }

  searchSideMenuItems(menuItem: Navigation): boolean {
    if (menuItem.children && menuItem.children.length > 0) {
      const tempArray = [];
      let tempItemWithExactMatchFlag: Navigation;
      menuItem.children.forEach(subMenuItem => {
        const tempItem = { ...subMenuItem };
        if (this.searchSideMenuItems(tempItem)) {
          tempItemWithExactMatchFlag = this.getExactMatchStatus(
            this.searchFormControl.value,
            tempItem
          );

          tempArray.push(tempItemWithExactMatchFlag);
        }
      });

      menuItem.children = tempArray;
      if (tempArray.length > 0) {
        return true;
      }
    }

    return this.searchFormControl.value
      .split(this.regExp)
      .some(
        token =>
          menuItem.name.toLowerCase().includes(token.toLowerCase()) &&
          menuItem.permission.transactionCodes.find(key =>
            this.permissionService.hasPermission(key)
          )
      );
  }

  @HostListener('keydown', ['$event'])
  keyEvent = (event: KeyboardEvent): void => this.focusEvent.next(event);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
