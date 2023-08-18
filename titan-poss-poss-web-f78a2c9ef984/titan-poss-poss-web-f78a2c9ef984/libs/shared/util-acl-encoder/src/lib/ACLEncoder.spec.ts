import AccessControl from './model/access-control.interface';
import { ACLEncoder as ACLService } from './ACLEncoder';

describe('Testing ACL Service Functionality', () => {
  const testAccessControlList = new Map<string, AccessControl>();
  const testEncodeACL = new Map<string, string>();
  const noOfAccessControls = 50;
  beforeAll(function() {
    for (let i = 0; i < noOfAccessControls; i++) {
      testAccessControlList.set(`I${i}`, <AccessControl>{
        ID: i,
        code: `I${i}`,
        name: `ACL${i}`,
        group: 'I'
      });
    }

    for (let i = 0; i < noOfAccessControls; i++) {
      testAccessControlList.set(`U${i}`, <AccessControl>{
        ID: i,
        code: `U${i}`,
        name: `ACL${i}`,
        group: 'U'
      });
    }

    for (let i = 0; i < noOfAccessControls; i++) {
      testAccessControlList.set(`M${i}`, <AccessControl>{
        ID: i,
        code: `M${i}`,
        name: `ACL${i}`,
        group: 'M'
      });
    }

    //testEncodeACL.set('I', '////////4A==')
    testEncodeACL.set('I', '////8AEA');
    testEncodeACL.set('U', 'QA');
    testEncodeACL.set('M', 'VVo=');
    //testEncodeACL.set('M', 'a')
  });

  it('Should return binary representation of Base64 code', () => {
    //Arrange
    const expectedBinaryResult = '0101010101011010';
    const base64Code = 'VVo=';
    //Act
    const result = ACLService.getBinaryStringFromBase64String(base64Code);
    //Assert
    expect(result).toEqual(expectedBinaryResult);
  });

  it('should return the selected ACL code for a Module', () => {
    //Arrange
    const binaryStringInput = '0101010101011010';
    const moduleName = 'I';
    //Act
    const result = ACLService.getACLCodeFromBinaryString(
      binaryStringInput,
      moduleName
    );

    //Assert
    expect(result.length).toBe(8);
  });

  it('Should return assigned ACL based on the Encode ACL codes', () => {
    //Arrange
    let noOfACL = 0;

    //Act
    const result = ACLService.getAllAssignedACL(testEncodeACL);
    const keys = Array.from(result.keys());

    keys.forEach(key => {
      noOfACL += result.get(key).length;
    });

    //Assert
    expect(noOfACL).toBe(38);
  });
});
