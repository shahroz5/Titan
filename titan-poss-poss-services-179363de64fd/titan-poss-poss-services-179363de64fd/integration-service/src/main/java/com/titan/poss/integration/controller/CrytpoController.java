
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.CertificateTypeEnum;
import com.titan.poss.integration.dto.request.SignatureDto;
import com.titan.poss.integration.service.CryptoService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for user lov.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationCryptoController")
@RequestMapping(value = "integration/v2/crypto")
public class CrytpoController {

	@Autowired
	CryptoService cryptoService;

	@ApiOperation(value = "This API provide key in response")
	@GetMapping(value = "/certificate")
	public Map<String, Object> getCertificate(
			@ApiParam(value = "Provide certificate type", required = true) @RequestParam(name = "certificateType", required = false) CertificateTypeEnum certificateType) {
		return cryptoService.getCertificate(certificateType);
	}

	@ApiOperation(value = "This API provide signatured value of request")
	@PostMapping(value = "/signature")
	public Map<String, Object> getSignature(
			@ApiParam(name = "body", value = "object that needs to be digitally signed", required = true) @RequestBody @Valid SignatureDto signatureDto) {
		return cryptoService.getSignature(signatureDto);
	}

	@ApiOperation(value = "Encrypt the string usinng asymmetric encryption")
	@GetMapping(value = "/encrypt")
	public String encryptInput(@RequestParam(name = "input", required = true) String input) {
		return cryptoService.encryptString(input);
	}

	@ApiOperation(value = "Decrypt the string usinng asymmetric decryption")
	@GetMapping(value = "/decrypt")
	public String decryptInput(@RequestParam(name = "input", required = true) String input) {
		return cryptoService.decryptString(input);
	}

}
