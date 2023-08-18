/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ItemGroupLevelDetails {

	private JsonData maxMetalCharge;

	private JsonData maxStoneCharges;

	private JsonData maxUCP;

	private JsonData maxMC;

	private JsonData maxPsPerGram;
}
