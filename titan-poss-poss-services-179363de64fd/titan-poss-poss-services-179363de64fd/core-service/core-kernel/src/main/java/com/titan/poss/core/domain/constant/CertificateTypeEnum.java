/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.domain.constant;

/**
 * Enum containing different types of certificate
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum CertificateTypeEnum {

	QZTRAY("digital-certificate.txt", "private-key.pem"), LOGIN("public.key", "");

	private String publicKey;
	private String privateKey;

	public String getPublicKey() {
		return publicKey;
	}

	public String getPrivateKey() {
		return privateKey;
	}

	private CertificateTypeEnum(String publicKey, String privateKey) {
		this.publicKey = publicKey;
		this.privateKey = privateKey;
	}

}
