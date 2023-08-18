import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { UsersActiveSessionsComponent } from './users-active-sessions/users-active-sessions.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [UsersActiveSessionsComponent],
  entryComponents: [UsersActiveSessionsComponent]
})
export class PossBodEodUiUsersActiveSessionsModule {}
