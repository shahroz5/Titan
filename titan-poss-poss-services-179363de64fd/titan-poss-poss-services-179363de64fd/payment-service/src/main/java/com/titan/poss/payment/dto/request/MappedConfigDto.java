/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

import com.titan.poss.payment.dto.DefaultDto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class MappedConfigDto {
	
	private List<DefaultDto> defaultList;

}
