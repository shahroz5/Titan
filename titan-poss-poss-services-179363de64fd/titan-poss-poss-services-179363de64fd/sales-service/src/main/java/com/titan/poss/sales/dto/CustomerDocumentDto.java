/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class CustomerDocumentDto {

	private String documentPath;

	private Integer customerId;

	private String customerMasterId;

	private String documentType;

	private String fileType;

	private String documentSubType;

	private Boolean isSynced;

	private String locationCode;

	private Date businessDate;

	private String txnId;

	private String custSignature;

	private String cashierSignature;

	private Boolean isQrCode;
}
