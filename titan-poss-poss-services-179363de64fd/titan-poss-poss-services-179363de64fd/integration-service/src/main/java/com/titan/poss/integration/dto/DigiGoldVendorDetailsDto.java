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
public class DigiGoldVendorDetailsDto {

	private String authorizationToken;

	private String encryptionKey;

	private String functionality;

	private String fetchBalanceUrl;

	private String sellingPriceUrl;

	private String sendOtpUrl;

	private String verifyOtpUrl;
	
	private String tanishqRedeemUrl;
	
	private String otherRedeemUrl;
	
	private String verifyTxnUrl1;
	
	private String verifyTxnUrl2;
	
	private String cancelTxnUrl1;
	
	private String cancelTxnUrl2;

}
