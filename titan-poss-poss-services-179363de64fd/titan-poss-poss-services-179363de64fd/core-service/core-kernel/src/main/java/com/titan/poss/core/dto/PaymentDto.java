/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {

	private String paymentCode;

	private String paymentGroup;

	private Boolean customerDependent;

	private List<FieldDetailDto> fields;

	private Object configDetails;

}
