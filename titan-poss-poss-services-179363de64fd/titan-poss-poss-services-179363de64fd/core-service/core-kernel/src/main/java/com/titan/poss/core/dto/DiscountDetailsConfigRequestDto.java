/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.ExcludeConfigDto;
import com.titan.poss.core.discount.dto.LinkDiscountDetailsDto;
import com.titan.poss.core.discount.dto.LocationOfferDetails;
import com.titan.poss.core.discount.dto.ProductCategoryDetails;
import com.titan.poss.core.discount.dto.ProductGroupDetails;
import com.titan.poss.core.discount.dto.RegularCategoryDetails;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.discount.dto.SlabDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountDetailsConfigRequestDto {

	private DiscountTypeEnum discountType;

	private String discountId;

	private LocationOfferDetails locationOfferDetails;

	private DiscountOrderConfigDetails orderConfigDetails;

	private SlabConfigDetails slabConfigDetails;

	private RegularCategoryDetails appliedDiscountComponent;

	private RegularCategoryDetails regularDiscountComponent;

	private SlabDetails slabDiscountComponents;

	private String appliedDiscountComponentType;

	private DiscountDto appliedDiscountMaster;

	private ProductGroupDetails productGroups;

	private ProductCategoryDetails productCategory;

	private ExcludeConfigDto excludeConfigDto;

	private JsonData applicableThemeDetails;

	private LinkDiscountDetailsDto linkDiscountDetails;
}
