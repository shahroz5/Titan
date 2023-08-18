import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsettingFacade } from './+state/appsetting.facade';

@NgModule({
  imports: [CommonModule],
  providers: [AppsettingFacade]
})
export class SharedAppsettingDataAccessAppsettingModule {}
