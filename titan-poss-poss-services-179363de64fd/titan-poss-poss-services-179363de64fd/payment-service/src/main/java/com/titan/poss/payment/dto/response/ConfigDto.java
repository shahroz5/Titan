/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.response;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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
public class ConfigDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	@NotNull
	@NotBlank
	@Size(min = 1, max = 15)
	private String paymentCode;

	@NotNull
	@NotBlank
	@Size(min = 1, max = 15)
	private String transactionType;

	private transient Object configDetails;

}
