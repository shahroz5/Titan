/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.validation.constraints.NotBlank;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RoChequeRefundDto extends TepChequeRefundDto {

	@NotBlank(message = "chequeNumber cannot be null or empty")
	private String chequeNumber;

	@NotBlank(message = "bankName cannot be null or empty")
	private String bankName;

	@NotBlank(message = "micrCode cannot be null or empty")
	private String micrCode;

}
