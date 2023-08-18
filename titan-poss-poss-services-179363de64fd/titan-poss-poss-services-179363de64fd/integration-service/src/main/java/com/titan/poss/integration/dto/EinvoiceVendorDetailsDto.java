/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class EinvoiceVendorDetailsDto {
	
    private String tokenUrl;
	
	private String generateIrnUrl;
	
	private String cancelIrnUrl;
	
	private String clientId;
	
	private String clientSecretKey;
	
    private String taxSch;
	
	private String supTyp;
	
	private String version;
	
	private String docTypeGrn;
	
	private String docTypeOthers;
	
	private String verifyGstAction;
	
	private String cancelIrnAction;
			
}
