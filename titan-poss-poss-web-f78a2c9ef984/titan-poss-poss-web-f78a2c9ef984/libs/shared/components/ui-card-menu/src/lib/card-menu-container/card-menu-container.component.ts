import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AppTypesEnum,
  CardMenu,
  CardSubMenu,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { POSS_APP_TYPE } from '@poss-web/shared/util-config';
import {
  getEpossBaseUrl,
  getPossBaseUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CardMenuComponent } from '../card-menu/card-menu.component';

const cardMenuShortcutKey = 'CardMenuContainerComponent.CARD_MENU';
const componentName = 'CardMenuContainerComponent';

@Component({
  selector: 'poss-web-card-menu-container',
  templateUrl: './card-menu-container.component.html'
})
export class CardMenuCcontainerComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() menu: CardMenu[] = [];
  @Input() subMenu: CardSubMenu[] = [];
  @Input() permissions$: Observable<any[]>;
  @Input() scrollTop = 0;
  @ViewChild(CardMenuComponent)
  cardMenuComponentRef: CardMenuComponent;

  showScrollUpOption = false;

  subMenuMap = new Map<string, CardSubMenu>();
  menuIndexMap = new Map<string, number>();
  selectedMenuIndex: number = null;

  selectedSubMenu: CardSubMenu;
  showMenu = true;
  translatedMenuArray: CardMenu[] = [];

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private shortcutService: ShortcutServiceAbstraction,
    @Inject(POSS_APP_TYPE) private appType
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scrollTop']) {
      this.showScrollUpOption = this.scrollTop > 50;
    }
    if (changes['menu']) {
      this.getSortedMenuSubmenus();
    }
  }
  getObjectWithTranslatedName(element) {
    let translatedMenuElement;
    if (!!element) {
      element.subTitleTranslationKey
        ? this.translate
            .get([element.titleTranslationKey, element.subTitleTranslationKey])
            .pipe(take(1))
            .subscribe(translatedName => {
              element.translatedName = `${
                translatedName[element.titleTranslationKey]
              } ${translatedName[element.subTitleTranslationKey]}`.trim();
              translatedMenuElement = element;
            })
        : this.translate
            .get(element.titleTranslationKey)
            .pipe(take(1))
            .subscribe(translatedName => {
              element.translatedName = translatedName.trim();
              translatedMenuElement = element;
            });
      return translatedMenuElement;
    }
  }
  getTranslatedNameForSubMenus(menuItemChildren) {
    const subMenusList = [];
    menuItemChildren.forEach(subMenuItem => {
      subMenusList.push(this.getObjectWithTranslatedName(subMenuItem));
    });
    return subMenusList;
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case cardMenuShortcutKey: {
        if (this.cardMenuComponentRef) {
          this.cardMenuComponentRef.focus();
        }
        break;
      }
    }
  }

  getSortedList(menuItems) {
    const byName = menuItems.slice(0);
    return byName.sort(function (a, b) {
      const x = a.translatedName.toLowerCase();
      const y = b.translatedName.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  getSortedMenuItemsByName(cardMenuList) {
    this.translatedMenuArray = [];
    if (!!cardMenuList && cardMenuList.length > 0) {
      cardMenuList.forEach(menuItem => {
        if (menuItem.hasChild && menuItem.child && menuItem.child.length > 0) {
          const childMenusWithTranslatedNames = this.getTranslatedNameForSubMenus(
            menuItem.child
          );
          menuItem.child = this.getSortedList(childMenusWithTranslatedNames);
        } else if (menuItem.subMenu && menuItem.subMenu.length > 0) {
          // This block is used for SubMenu items, Offer configuration - Discount modules (has 3rd level)
          const childMenusWithTranslatedNames = this.getTranslatedNameForSubMenus(
            menuItem.subMenu
          );
          menuItem.subMenu = this.getSortedList(childMenusWithTranslatedNames);
        }
        this.translatedMenuArray.push(
          this.getObjectWithTranslatedName(menuItem)
        );
      });
      return this.getSortedList(this.translatedMenuArray);
    } else {
      return cardMenuList;
    }
  }

  ngOnInit(): void {
    this.getSortedMenuSubmenus();

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
        if (
          queryParamMap.has('menu') &&
          this.menuIndexMap.has(queryParamMap.get('menu'))
        ) {
          const menyKey = queryParamMap.get('menu');
          this.selectedMenuIndex = this.menuIndexMap.get(menyKey);
        } else if (param.subMenu) {
          if (this.subMenuMap.has(param.subMenu)) {
            this.showMenu = false;
            this.selectedSubMenu = this.subMenuMap.get(param.subMenu);
          } else {
            this.showMenu = true;
          }
        }
      });

    this.shortcutService.componentNames = [componentName];  
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  getSortedMenuSubmenus() {
    this.menu = this.getSortedMenuItemsByName(this.menu);

    this.menu.forEach((menu, index) => {
      this.menuIndexMap.set(menu.menuKey, index);
    });
    this.subMenu = this.getSortedMenuItemsByName(this.subMenu);

    this.subMenu.forEach(menu => {
      this.subMenuMap.set(menu.subMenuPath, menu);
    });
  }

  loadSubMenu(subMenuPath: string) {
    if (this.subMenuMap.has(subMenuPath)) {
      this.selectedSubMenu = this.subMenuMap.get(subMenuPath);
      this.showMenu = false;
      this.router.navigate(['..', subMenuPath], {
        relativeTo: this.activatedRoute
      });
    }
  }

  menuSelected(object: { routePath: string; appType: string }) {
    if (!!object && !!object.appType && this.appType !== object.appType) {
      const appTypeUrl =
        object.appType === AppTypesEnum.EPOSS
          ? getEpossBaseUrl()
          : getPossBaseUrl();
      const routePath = object.routePath.startsWith('/')
        ? `../${appTypeUrl}${object.routePath}`
        : `../${appTypeUrl}/${object.routePath}`;

      window.location.href = routePath;
    } else {
      this.router.navigate([object.routePath]);
    }
  }

  navigateMenu(menuKey: string) {
    this.showMenu = true;
    this.router.navigate(['..', 'home'], {
      relativeTo: this.activatedRoute,
      queryParams: { menu: menuKey }
    });
  }

  scrollUp() {
    document.getElementsByTagName('mat-sidenav-content')[0].scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
