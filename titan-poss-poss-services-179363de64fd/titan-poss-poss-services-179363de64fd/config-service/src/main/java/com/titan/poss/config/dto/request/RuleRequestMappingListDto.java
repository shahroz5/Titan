/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.List;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.SqlInjectionCheck;
import javax.validation.constraints.Positive;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.RuleGroupEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
public class RuleRequestMappingListDto {
	
	@Positive
	private Integer ruleId;

	@SqlInjectionCheck
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String description;

	private List<@SqlInjectionCheck @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCode;

	private List<@SqlInjectionCheck @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroupCode;

	private List<@SqlInjectionCheck @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategoryCode;

	@ValueOfEnum(enumClass = RuleGroupEnum.class) 
	private String ruleGroup;
	
	@ValueOfEnum(enumClass = RuleTypeEnum.class) 
	private String ruleType;
	
	private Boolean isActive;

}
