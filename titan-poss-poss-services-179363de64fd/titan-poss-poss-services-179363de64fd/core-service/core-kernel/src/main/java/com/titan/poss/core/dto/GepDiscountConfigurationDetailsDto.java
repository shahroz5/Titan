/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to get GEP configuration details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GepDiscountConfigurationDetailsDto {

	private String configId;

	private String configCode;

	private String configType;

	private Boolean isOfferEnabled;

	private JsonData configDetails;// GepConfigDetails

	private JsonData offerDetails;// GepOfferDetails

	private JsonData excludeItemCodeList;

	private JsonData excludeThemeCodeList;

	private JsonData purityProductDetails;

	private JsonData rivaahAdditionalpurityProductDetails;

}
