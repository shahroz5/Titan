/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import lombok.Data;

/**
 * Response DTO of focScheme Id's added as part of Pending FOC
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocPendingResponseDto {

	private List<String> focSchemeIds;

}
