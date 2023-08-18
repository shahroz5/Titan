/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.discount.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegularCategoryDetails extends BaseFieldsValidator {

	MetalChargeData goldCharges;

	StoneChargeData stoneCharges;

	UcpData isUCP;

	MakingChargeData mcCharges;

	RsPerGramData rsPerGram;
}
