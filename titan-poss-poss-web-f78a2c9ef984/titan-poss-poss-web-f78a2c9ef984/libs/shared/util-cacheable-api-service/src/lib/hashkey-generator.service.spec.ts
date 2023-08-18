import { HashkeyGeneratorService } from './hashkey-generator.service';

import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { HttpParams } from '@angular/common/http';

describe('Caching: Hashkey Generator Service', () => {
  let service: HashkeyGeneratorService;
  const apiURL =
    'http://ec2-13-234-124-250.ap-south-1.compute.amazonaws.com/api';
  const url = '/engine/v2/product/product-groups';
  const params = new HttpParams();

  beforeEach(() => {
    service = new HashkeyGeneratorService(apiURL);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateKeyfromData(): should generate hash key', () => {
    const dataForHashCodeGeneration = `${apiURL}${url}?${params}`;
    const hashDigest = sha256(dataForHashCodeGeneration);
    const generatedKey = Base64.stringify(hashDigest);

    expect(service.generateKeyfromData(url, params)).toBe(generatedKey);
  });
});
