/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import com.titan.poss.core.discount.dto.RsPerGramData;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

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
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ItemGroupConfig extends BaseFieldsValidator {

	ItemMetalChargeData maxMetalCharge;

	ItemStoneChargeData maxStoneCharges;

	ItemUcpData maxUCP;

	ItemMakingChargeData maxMC;

	RsPerGramData maxPsPerGram;

}
