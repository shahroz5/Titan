export class CardMenu {
  menuKey?: string;
  titleTranslationKey: string;
  subTitleTranslationKey?: string;
  path?: string;
  hasChild: boolean;
  appType?: string;
  child?: CardMenu[];
  iconClass?: string;
  subMenuPath?: string;
  elementName?: string;
  translatedName?: string;
  isOffline?: string;
}

export class CardSubMenu {
  menuKey: string;
  subMenuPath: string;
  titleTranslationKey: string;
  subMenu: CardSubMenuItem[];
}

export class CardSubMenuItem {
  elementName?: string;
  titleTranslationKey: string;
  path?: string;
}
