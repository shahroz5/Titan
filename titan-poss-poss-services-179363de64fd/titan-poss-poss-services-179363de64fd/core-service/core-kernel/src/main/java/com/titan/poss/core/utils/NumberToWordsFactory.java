/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.DomainConstants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class NumberToWordsFactory {

	public String getPriceInWords(long amount, String type) {

		if (type.equals(DomainConstants.ASIAN_PRICE_TYPE)) {
			return new AsianStandardNumberToWords().convert(amount);

		} else {
			return new USStandardNumberToWords().convert(amount);
		}
	}

}
