/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RuleMasterResponseDto {

	private Integer ruleId;
	private String ruleType;
	private String description;
	private JsonData ruleDetails;
	private Boolean isActive;
	private Date createdDate;
	private Date lastModifiedDate;
}
