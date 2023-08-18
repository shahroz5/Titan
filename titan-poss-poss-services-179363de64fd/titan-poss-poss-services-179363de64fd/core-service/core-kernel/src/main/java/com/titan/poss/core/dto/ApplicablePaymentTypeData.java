/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ApplicablePaymentTypeData implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotNull(message = "grn cannot be null")
	private Boolean grn;

	@NotNull(message = "ghsMaturity cannot be null")
	private Boolean ghsMaturity;

	@NotNull(message = "advanceCN cannot be null")
	private Boolean advanceCN;

	@NotNull(message = "billCancel cannot be null")
	private Boolean billCancel;

	@NotNull(message = "giftCard cannot be null")
	private Boolean giftCard;

	@NotNull(message = "CN IBT cannot be null")
	private Boolean cnIBT;

}
