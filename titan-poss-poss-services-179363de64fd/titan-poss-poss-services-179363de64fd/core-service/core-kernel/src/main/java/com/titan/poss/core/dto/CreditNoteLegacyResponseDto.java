/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CreditNoteLegacyResponseDto {

	private CreditNoteLegacyOutboundRequestDto creditNoteLegacyOutboundRequestDto;

	private Boolean status;

	private String errorMessage;

}
