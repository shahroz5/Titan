import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CardListComponent } from './card-list.component';
import {
  CardComponent,
  CardTitleComponent,
  CardSubtitleComponent,
  CardContentComponent
} from './card/card.component';


@NgModule({
  declarations: [
    CardListComponent,
    CardComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    CardContentComponent
  ],
  imports: [CommonCustomMaterialModule],
  exports: [
    CardListComponent,
    CardComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    CardContentComponent
  ]
})
export class SharedComponentsUiCardListModule {}
