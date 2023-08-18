/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for GV other details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiftVoucherOtherDetailsDto {

	private String redemptionType;
	private BigDecimal giftVoucherValue;
	private Integer creditNoteNo;
	private Boolean isLegacyUpdated;
	private List<String> productGroupDetails;
}
