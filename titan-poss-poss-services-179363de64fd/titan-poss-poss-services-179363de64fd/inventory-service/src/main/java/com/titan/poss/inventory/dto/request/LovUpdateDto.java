/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.titan.poss.inventory.dto.response.KeyValueDto;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LovUpdateDto {


	@NotEmpty(message = "values cannot be Empty")
	private List<KeyValueDto> values;


}
