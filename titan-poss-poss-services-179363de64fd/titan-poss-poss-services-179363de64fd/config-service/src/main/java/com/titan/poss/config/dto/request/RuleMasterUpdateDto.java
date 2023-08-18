/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Data
public class RuleMasterUpdateDto {

	private Boolean isActive;
	
	private JsonData ruleDetails;
	
}
