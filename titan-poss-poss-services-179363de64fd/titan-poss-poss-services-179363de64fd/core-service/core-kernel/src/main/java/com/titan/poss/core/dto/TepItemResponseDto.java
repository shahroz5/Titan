/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TepItemResponseDto extends TepProductGroupConfigDetails {

	private TepExceptionDetailsResponseDto tepOfferDetails; // used

	private TepGeneralCodeConfigDto tepGeneralCodeConfig;

	private TepCutPieceConfigDto tepCutPieceConfig;
	
	private TepValidationConfigDetails tepValidationConfig;
	
	private BigDecimal refundCashLimit;
	
	private String allowedRefundMode;
	
	private List<String> subRefundModes;
	
	private BigDecimal maxFlatTepException;
	

}
