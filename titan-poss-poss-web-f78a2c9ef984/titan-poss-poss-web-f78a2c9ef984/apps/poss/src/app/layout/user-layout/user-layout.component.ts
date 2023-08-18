import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-user-layout',
  template: '<poss-web-navigation></poss-web-navigation>'
})
export class UserLayoutComponent {
  showSideMenu = false;
  showTopMenu = true;
  isLightTheme = true;

  set ShowSideMenu(visible: boolean) {
    this.showSideMenu = visible;
  }

  set ShowTopMenu(visible: boolean) {
    this.showTopMenu = visible;
  }

  constructor(public router: Router, public dialog: MatDialog) {
    if (document.body.classList.contains('pw-light-theme')) {
      this.isLightTheme = true;
    } else {
      this.isLightTheme = false;
    }
  }
}
