import { PermissionData } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ButtonType } from '../enums/commandButton.enum';

export interface CommandButton {
  name: string;
  cssClassName?: string;
  type: ButtonType;
  i?: number;
  permission?: Observable<PermissionData>;
}
