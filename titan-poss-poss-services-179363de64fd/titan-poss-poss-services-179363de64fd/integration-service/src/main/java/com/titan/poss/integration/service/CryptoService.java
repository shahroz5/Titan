/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

import java.util.Map;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.CertificateTypeEnum;
import com.titan.poss.integration.dto.request.SignatureDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CryptoService {

	Map<String, Object> getCertificate(CertificateTypeEnum certificateType);

	Map<String, Object> getSignature(@Valid SignatureDto signatureDto);

	public String encryptString(String input);

	public String decryptString(String input);
}
