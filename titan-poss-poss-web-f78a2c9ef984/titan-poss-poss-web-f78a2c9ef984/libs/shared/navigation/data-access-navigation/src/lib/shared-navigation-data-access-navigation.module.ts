import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavService } from './sidenav.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { SharedAuthDataAccessAuthModule } from '@poss-web/shared/auth/data-access-auth';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedUtilApiServiceModule,
    SharedAuthDataAccessAuthModule
  ],
  providers: [SidenavService]
})
export class SharedNavigationDataAccessNavigationModule {}
