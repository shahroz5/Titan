/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto.request;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.payment.dto.CreateCustomerConfigDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomerConfigRequestDto {

	private Set<@Valid CreateCustomerConfigDto> addConfigs;

	private Set<String> removeConfigs;

}
