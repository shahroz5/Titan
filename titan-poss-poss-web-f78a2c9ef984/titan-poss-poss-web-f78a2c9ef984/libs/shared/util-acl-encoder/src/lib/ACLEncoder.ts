import ByteEncoder from './encoder/ByteEncoder';
import GenericError from './encoder/GenericError';

/**
 * Utility class providing methods to translate the Base64 encoded string to ACL List.
 */
// @dynamic
export class ACLEncoder {
  /**
   *  returns the binary representation of Base64 encoded string
   * @param Base64 Encoded ACL String
   */
  static getBinaryStringFromBase64String(base64String: string): string {
    const bytes = ByteEncoder.bytesFromBase64String(base64String);
    const bin = ByteEncoder.binaryStringFromBytes(bytes);
    return bin;
  }

  /**
   * returns the collection of all the selected ACL
   * @param encodedAcl
   *
   */
  static getAllAssignedACL(
    encodedAcl: Map<string, string>
  ): Map<string, string[]> {
    const assignedACL: Map<string, string[]> = new Map<string, string[]>();
    if (encodedAcl !== undefined) {
      const modules = Array.from(encodedAcl.keys());
      let binaryString: string;

      modules.forEach(module => {
        binaryString = this.getBinaryStringFromBase64String(
          encodedAcl.get(module)
        );
        assignedACL.set(
          module,
          this.getACLCodeFromBinaryString(binaryString, module)
        );
      });
    } else {
      throw new GenericError('Encoded ACL List not provided.');
    }
    return assignedACL;
  }

  /**
   *
   * @param binaryString
   * @param moduleName
   */
  static getACLCodeFromBinaryString(
    binaryString: string,
    moduleName: string
  ): string[] {
    const aclPositions = [...binaryString];
    let selectedAcl: string[];
    selectedAcl = [];
    aclPositions.forEach((value, index) => {
      if (value === '1') {
        selectedAcl.push(`${moduleName}${index}`);
      }
    });
    return selectedAcl;
  }

  static getMapFromStringArray(acl: string[]): Map<string, string> {
    const encodedACLMap = new Map<string, string>();
    if (!!acl && acl.length > 0) {
      acl.forEach(value => {
        const tempStringArray = value.split('-');
        encodedACLMap.set(tempStringArray[0], tempStringArray[1]);
      });
    }
    return encodedACLMap;
  }
}
