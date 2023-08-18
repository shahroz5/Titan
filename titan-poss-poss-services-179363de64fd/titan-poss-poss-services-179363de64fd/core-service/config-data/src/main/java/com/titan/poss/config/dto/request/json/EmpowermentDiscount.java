/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EmpowermentDiscount implements Serializable {

	private static final long serialVersionUID = 1L;

	@JsonProperty("is_making_charges")
	private Boolean isMakingCharge;

	@JsonProperty("is_metal_charges")
	private Boolean isMetalCharge;

	@JsonProperty("is_stone_charges")
	private Boolean isStoneCharge;

	@JsonProperty("is_ucp_charges")
	private Boolean isUCP;

}
