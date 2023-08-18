/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.response;

import java.util.Date;

import com.titan.poss.core.dto.ManualBillCreateDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to get response of manual bill after password generation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ManualBillResponseDto extends ManualBillCreateDto {

	private String id;
	private String password;
	private Date passwordDate;
}
