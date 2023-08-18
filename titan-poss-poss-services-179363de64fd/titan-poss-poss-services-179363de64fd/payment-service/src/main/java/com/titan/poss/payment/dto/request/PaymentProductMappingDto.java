/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Gift Card Product Mapping Dto")
@Data
public class PaymentProductMappingDto {

	@ApiModelProperty(position = 1, value = "Add Payment Category Product Mapping Code", name = "addProductMapping", notes = "To add or update", required = false)
	private List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> addProductGroupCode;

	@ApiModelProperty(position = 2, value = "Ids of which needs to be deactivated", name = "removeProductMappingIds", notes = "To remove", required = false)
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProductMappingIds;
}
