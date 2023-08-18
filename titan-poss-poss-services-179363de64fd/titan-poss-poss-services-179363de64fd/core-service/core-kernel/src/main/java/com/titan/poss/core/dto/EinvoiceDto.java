/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EinvoiceDto {

	private String invoiceNumber;
	private String acknowledgementNo;
	private Date acknowledgementDate;
	private String qrCodeValue;
	private String qrCode;

	/**
	 * Size of QR code in print
	 */
	private Integer height = 120;
}
