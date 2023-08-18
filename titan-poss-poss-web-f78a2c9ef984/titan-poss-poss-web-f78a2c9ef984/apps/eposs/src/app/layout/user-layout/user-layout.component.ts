import { Component } from '@angular/core';

@Component({
  selector: 'poss-web-user-layout',
  template: '<poss-web-navigation></poss-web-navigation>'
})
export class UserLayoutComponent {
  showSideMenu = false;
  showTopMenu = true;

  set ShowSideMenu(visible: boolean) {
    this.showSideMenu = visible;
  }

  set ShowTopMenu(visible: boolean) {
    this.showTopMenu = visible;
  }
}
