/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PrintableDto {

	List<String> getTemplateName();

	CustomerDocumentDto getDocumentDetails();

	default String generateFilePath(CustomerDocumentDto customerDocument) {

		DocumentBucketEnum baseFolder = DocumentBucketEnum.valueOf(customerDocument.getDocumentSubType());

		//@formatter:off
		return new StringBuilder()	
				.append("/")														// /
				.append(baseFolder.getBucketName()).append("/")						// nap-customer-transactions/
				.append(customerDocument.getLocationCode()).append("/")				// CPD/
//				.append(customerDocument.getCustomerMasterId()).append("/")			// <CUSTOMER-MASTER-UUID>/
				.append(customerDocument.getTxnId()).append("/")					// <TXN-UUID>/
				.append(customerDocument.getDocumentType()).append(".").append(FileExtensionEnum.PDF.getValue())	// GC_PRINTS.pdf
				.toString();
		//@formatter:on
	}
}
