/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.response;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TaxConfigsDto {

	private String id;

	private String txnType;

	private String srcLocationTaxType;

	private String destLocationTaxType;

	private String srcLocationApplicableTax;

	private String destLocationApplicableTax;

	private String customerTaxType;

	private Boolean isSameState;

	private Boolean srcTaxApplicable;

	private Boolean isActive;

	private String applicableTax;
}
