import { Lov } from '@poss-web/shared/models';

export class LovAdaptor {
  static LovDataFromJson(data: any): Lov {
    return {
      code: data.code,
      isActive: data.isActive,
      value: data.value
    };
  }
}
