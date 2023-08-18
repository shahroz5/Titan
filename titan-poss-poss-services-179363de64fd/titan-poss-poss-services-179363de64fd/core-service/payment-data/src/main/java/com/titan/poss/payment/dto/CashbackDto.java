/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.Date;

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
public class CashbackDto {

	private String id;

	private String cashbackName;

	private String bankName;

	private String cardNoLength;

	private Date startDate;

	private Date endDate;

	private Integer firstCardDigits;

	private Integer lastCardDigits;

	private Boolean mobileFlag;

	private Integer maxUsageCount;

	private String cmRemarks;

	private String offerRemarks;

	private Boolean isActive;

	private Boolean excludeCashback;

	private Boolean isCashbackAmount;
}
