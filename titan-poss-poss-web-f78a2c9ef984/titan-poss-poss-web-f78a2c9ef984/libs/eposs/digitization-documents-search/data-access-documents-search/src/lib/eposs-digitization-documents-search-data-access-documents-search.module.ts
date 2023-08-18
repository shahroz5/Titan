import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { DocumentsSearchEffect } from './+state/documents-search.effects';
import {
  DocumentsSearchReducer,
  documentSearchFeatureKey
} from './+state/documents-search.reducer';
import { DocumentsSearchFacade } from './+state/documents-search.facade';
import { DocumentsSearchService } from './documents-search.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(documentSearchFeatureKey, DocumentsSearchReducer),
    EffectsModule.forFeature([DocumentsSearchEffect])
  ],
  providers: [DocumentsSearchFacade, DocumentsSearchService]
})
export class EpossDigitizationDocumentsSearchDataAccessDocumentsSearchModule {}
