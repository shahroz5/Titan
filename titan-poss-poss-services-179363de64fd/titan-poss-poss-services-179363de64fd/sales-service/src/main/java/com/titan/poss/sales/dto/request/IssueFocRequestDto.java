/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

/**
 * Request DTO class for Issue of Pending FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class IssueFocRequestDto {

	@NotEmpty
	List<@Valid IssueFocDetailsRequestDto> focDetails;

}
