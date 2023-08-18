import { ACLModuleDetails } from '@poss-web/shared/models';
import { ACLModuleDetailsAdaptors } from '../access-control-mgmt/access-control-mgmt-module-details.adaptor';

export class ACLModuleDetailsHelper {
  static getModules(data: any): ACLModuleDetails[] {
    const modules: ACLModuleDetails[] = [];
    for (const moduleData of data.results) {
      modules.push(ACLModuleDetailsAdaptors.fromJson(moduleData));
    }
    return modules;
  }
}
