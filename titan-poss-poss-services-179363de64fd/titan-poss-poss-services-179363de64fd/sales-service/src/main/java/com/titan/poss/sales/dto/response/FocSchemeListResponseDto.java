/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response DTO of focScheme linked to Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
public class FocSchemeListResponseDto {

	private List<FocSchemeResponseDto> focSchemes;

}
