/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto;

import java.util.Set;

import javax.validation.Valid;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentHostnameUpdateDto {
	private Set<@Valid PaymentHostnameDto> paymentHostnamesDetails;
}
