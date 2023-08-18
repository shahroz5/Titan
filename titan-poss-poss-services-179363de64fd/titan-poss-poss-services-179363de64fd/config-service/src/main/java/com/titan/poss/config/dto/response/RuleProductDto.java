/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.io.Serializable;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RuleProductDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	private String productGroupCode;

	private String productCategoryCode;

	private String rangeId;

	private transient JsonData ruleDetails;

}
