import { ACLDetails } from '@poss-web/shared/models';
import { ACLDetailsAdaptors } from '../access-control-mgmt/access-control-mgmt-acl-details.adaptor';

export class ACLDetailsHelper {
  static getACL(data: any): ACLDetails[] {
    const aclList: ACLDetails[] = [];
    for (const acl of data.results) {
      aclList.push(ACLDetailsAdaptors.fromJson(acl));
    }
    return aclList;
  }
}
