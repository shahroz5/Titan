/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EinvoiceIrnDetailsResponseDto {

	private String referenceId;

	private String transactionType;

	private String invoiceNumber;

	private String qrCodeValue;

	private String acknowledgementNo;

	private Date acknowledgementDate;

	private Boolean status;

	private String errorMessage;
}
