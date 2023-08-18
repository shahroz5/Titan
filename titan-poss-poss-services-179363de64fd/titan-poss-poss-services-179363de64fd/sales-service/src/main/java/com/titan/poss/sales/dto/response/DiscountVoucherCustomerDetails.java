/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Customer details DTO for discount voucher
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountVoucherCustomerDetails {

	private Integer accountCustomerId;
	private String customerName;
	private String mobileNo;
	private String ulpId;
	private String emailId;
	private List<String> address;

}
