import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedNgrxRouterDataAccessRouterModule } from '@poss-web/shared/ngrx-router/data-access-router';

@NgModule({
  imports: [CommonModule, SharedNgrxRouterDataAccessRouterModule]
})
export class SharedNgrxRouterFeatureRouterModule {}
