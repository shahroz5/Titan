/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CashbackValueResponseDto {

	private BigDecimal discountValue;

	private Boolean isExcludeCashback;

	private String bankName;

	private Date offerEndDate;

	private BigDecimal minInvoiceAmt;

	private Integer maxUsageCount;
}
