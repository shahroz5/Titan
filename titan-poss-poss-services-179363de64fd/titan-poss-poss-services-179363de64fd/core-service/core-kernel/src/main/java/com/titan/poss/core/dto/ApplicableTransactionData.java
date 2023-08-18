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
public class ApplicableTransactionData implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotNull(message = "AdvanceBooking Field cannot be null")
	private Boolean advanceBooking;

	@NotNull(message = "CashMemo cannot be null")
	private Boolean cashMemo;

	@NotNull(message = "ghs cannot be null")
	private Boolean ghs;

	@NotNull(message = "CustomerOrder cannot be null")
	private Boolean customerOrder;

	@NotNull(message = "acceptAdvance cannot be null")
	private Boolean acceptAdvance;

	@NotNull(message = "grf cannot be null")
	private Boolean grf;

	@NotNull(message = "giftCardValue cannot be null")
	private Boolean giftCardValue;
	
    @NotNull(message = "servicePoss cannot be null")
    private Boolean servicePoss;

}
