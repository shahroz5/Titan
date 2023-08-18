/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request.json;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;
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
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BrandTaxDetails extends BaseFieldsValidator {
	private Boolean isAdvancedCNAllowed;
	private Boolean isGhsAllowed;
	private Boolean isOnSingleInvoice;
	private JewelleryDetails jewellery;
	private Form60Details form60;
	private BullionDetails bullion;
	private SilverPlatinumConfigDetails silverPlatinumConfig;
	
}
