/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GepExcludeItemCodeDetails extends BaseFieldsValidator {

	private List<String> itemList;
}
