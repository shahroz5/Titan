/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.response;

import java.util.List;

import com.titan.poss.core.dto.FieldDetailDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PaymentDto{

	private String paymentCode;

	private String description;

	private String paymentGroup;

	private Boolean isActive;
	
	private Boolean customerDependent;
	
	private Boolean isEditable;

	private List<FieldDetailDto> fields;

}
