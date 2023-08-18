/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum DocumentBucketEnum {

	CUSTOMER_TRANSACTION("nap-customer-transactions"), BANKING("nap-bankings"),
	CUSTOMER_DOCUMENT("nap-customer-document");

	// C:\TITAN\docs\CUSTOMER_TRANSACTION\CPD\A0D1EA95-0F5A-4927-B1D3-C538A0303EAB\E51AC96F-5855-47DD-A44F-E0CC0A62D0B9\CM_PRINTS.pdf
	// C:\TITAN\docs\BANKING\CPD\02-15-2021\CHEQUE_DEPOSITS.pdf
	// C:\TITAN\docs\CUSTOMER_DOCUMENT\CUSTOMER_UUID\DOCUMENT_TYPE_DOCUMENT_SUBTYPE.pdf

	private String bucketName;

	private DocumentBucketEnum(String bucketName) {
		this.bucketName = bucketName;
	}

	public String getBucketName() {
		return bucketName;
	}

	public static DocumentBucketEnum getBucketByName(String bucketName) {

		DocumentBucketEnum documentEnum = null;

		for (DocumentBucketEnum bucket : values()) {
			if (bucket.getBucketName().equals(bucketName)) {
				documentEnum = bucket;
				break;
			}
		}

		return documentEnum;
	}
}
