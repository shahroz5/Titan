/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.math.BigInteger;
import java.util.List;

import com.titan.poss.core.enums.GiftVoucherStatusEnum;

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
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GiftErrorDto {
	
	private BigInteger serialNo;
	
	private String status;
	
	List<GiftVoucherStatusEnum>  updatableStaus;

}
