/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.List;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GepConfigDetailsRes {

	private String gepConfigCode;

	private String gepConfigId;

	private String gepConfigType;
	//
	private JsonData gepOfferDetails;
	private JsonData gepConfigDetails;
	private Boolean isOfferEnabled;

	private List<GepPurityItemsDto> itemDetails;
}
