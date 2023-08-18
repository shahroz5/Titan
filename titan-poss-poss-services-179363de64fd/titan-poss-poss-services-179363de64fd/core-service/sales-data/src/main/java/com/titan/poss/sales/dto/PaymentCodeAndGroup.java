/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
public class PaymentCodeAndGroup {

	private String paymentCode;
	private String paymentGroup;

	@Override
	public boolean equals(Object obj) {

		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PaymentCodeAndGroup other = (PaymentCodeAndGroup) obj;

		boolean isCodeNull = (other.getPaymentCode() == null);
		boolean isGroupNull = (other.getPaymentGroup() == null);

		boolean isEqual = true;

		if (isCodeNull && isGroupNull)
			isEqual = false;
		else if ((isCodeNull && this.paymentCode.equals(other.getPaymentCode()))
				|| (isGroupNull && this.paymentGroup.equals(other.getPaymentGroup()))
				|| (this.paymentCode.equals(other.getPaymentCode())
						&& this.paymentGroup.equals(other.getPaymentGroup())))
			isEqual = true;
		else
			isEqual = false;

		return isEqual;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((paymentCode == null) ? 0 : paymentCode.hashCode());
		result = prime * result + ((paymentGroup == null) ? 0 : paymentGroup.hashCode());
		return result;
	}

	public static List<String> getPaymentCodes(Set<PaymentCodeAndGroup> paymentCodeAndGrps) {

		List<String> paymentCodes = new ArrayList<>();
		paymentCodeAndGrps.forEach(paymentCodeAndGroup -> paymentCodes.add(paymentCodeAndGroup.getPaymentCode()));

		return paymentCodes;
	}

}
