/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.response;

import com.titan.poss.report.dto.request.UserSearchQueryRequestDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class UserSearchQueriesDto extends UserSearchQueryRequestDto {

	private String id;

	private String reportMasterId;
}
