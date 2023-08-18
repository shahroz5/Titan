import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusableListItemDirective } from './focusable-list-item.directive';
import { FocusableListDirective } from './focusable-list.directive';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [FocusableListItemDirective, FocusableListDirective],
  exports: [FocusableListItemDirective, FocusableListDirective]
})
export class SharedComponentsUiFocusableListModule {}
