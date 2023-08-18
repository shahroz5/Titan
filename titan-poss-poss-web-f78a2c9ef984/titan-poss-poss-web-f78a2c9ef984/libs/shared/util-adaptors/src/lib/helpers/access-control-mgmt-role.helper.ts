import { ACLRole } from '@poss-web/shared/models';
import { ACLRoleAdaptors } from '../access-control-mgmt/access-control-mgmt-role.adaptor';

export class ACLRoleHelper {
  static getRoles(data: any): ACLRole[] {
    const roles: ACLRole[] = [];
    for (const item of data.results) {
      roles.push(ACLRoleAdaptors.fromJson(item));
    }
    return roles;
  }
}
