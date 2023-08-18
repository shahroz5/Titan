/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.sales.dto.response.OrderResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * DTO class for Header data of Order Manual Bill approval request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderManualBillRequestHeaderDto extends OrderResponseDto {

	private String title;

	private String customerName;

	private String customerType;

	private String ulpId;

	private String mobileNumber;

	private String instiTaxNo;

	private String custTaxNo;

	private String passportId;

	private BigDecimal pointBalance;

	private String currentTier;

	private Date enrollmentDate;

	private Boolean isMemberBlocked;

	private Boolean isPulseCustomer;

}
