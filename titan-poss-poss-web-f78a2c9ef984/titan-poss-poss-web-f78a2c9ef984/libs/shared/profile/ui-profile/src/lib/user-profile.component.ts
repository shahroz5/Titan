import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';

import { SelectDropDownOption, UserProfile } from '@poss-web/shared/models';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() userProfile: UserProfile;
  @Input() isBTQUser = false;
  @Input() roleTypesList: SelectDropDownOption[] = [];

  @Output() changePassword = new EventEmitter();
  @Output() validateOTP = new EventEmitter<string>();

  constructor(@Inject(POSS_WEB_DATE_FORMAT) public dateFormat) {}

  getUserType(): string {
    if (this.roleTypesList && this.roleTypesList.length > 0) {
      return this.roleTypesList?.find(
        x => x.value === this.userProfile.userType
      )?.description;
    }
  }
}
