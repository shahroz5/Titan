/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.request;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.CustomerTaxTypeEnum;
import com.titan.poss.core.enums.DestLocationTaxTypeEnum;
import com.titan.poss.core.enums.SrcLocationTaxTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TaxConfigsCreateDto {

	@ValueOfEnum(enumClass = SrcLocationTaxTypeEnum.class)
	private String srcLocationTaxType;

	@ValueOfEnum(enumClass = DestLocationTaxTypeEnum.class)
	private String destLocationTaxType;

	@ValueOfEnum(enumClass = CustomerTaxTypeEnum.class)
	private String customerTaxType;

	private Boolean isActive;

	private Boolean isSameState;

	private Boolean srcTaxApplicable;

	private String srcLocationApplicableTax;

	private String destLocationApplicableTax;

	//@ValueOfEnum(enumClass = ApplicableTaxEnum.class)
	private String applicableTax;

	@ValueOfEnum(enumClass = TxnTaxTypeEnum.class)
	private String txnType;

}
