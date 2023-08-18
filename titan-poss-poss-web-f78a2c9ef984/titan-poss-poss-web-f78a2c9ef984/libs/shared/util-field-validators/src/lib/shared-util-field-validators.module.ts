import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldValidatorsService } from './field-validators.service';
import { MaxLengthValidatorDirective } from './max-length-validators.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MaxLengthValidatorDirective],
  providers: [FieldValidatorsService],
  exports: [MaxLengthValidatorDirective]
})
export class SharedUtilFieldValidatorsModule {}
