/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.TepConfigDetails;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountDetailsBaseDto {

	private String discountType;
	private String discountId;
	private String discountCode;
	private String refDiscountTxnId;

	private BaseBasicCriteriaDetails basicCriteriaDetails;

	private DiscountAttributesDto discountAttributes;

	private ClubbingConfigDetails clubbingDetails;

	private DiscountGrnConfigDetails grnConfigDetails;

	private TepConfigDetails tepConfigDetails;

	private DiscountOrderConfigDetails orderConfigDetails;

	private LocationOfferDetails locationOfferDetails;

	private LinkDiscountDetailsDto linkDiscountDetails;

	private SlabConfigDetails slabConfigDetails;

	private JsonData applicableThemeDetails;

	private RegularCategoryDetails appliedDiscountComponent;

	private RegularCategoryDetails regularDiscountComponent;

	private SlabDetails slabDiscountComponents;

	private String appliedDiscountComponentType;

	private DiscountDto appliedDiscountMaster;

	private ProductGroupDetails productGroups;

	private ProductCategoryDetails productCategory;

	private ExcludeConfigDto excludeConfigDto;

	private JsonData exchangeConfigDetails;

	private GhsExcludeProductGroupDetailsDto ghsExcludeProductGroupDetails;

}
