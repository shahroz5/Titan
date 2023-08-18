/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ConfirmEGHSRequestDto extends RemarksBaseDto {

	BigDecimal transferAmount;
	Integer accountNumber;// no use of it
	String locationCode;// no use of it
	Short fiscalYear;// use of it

}
