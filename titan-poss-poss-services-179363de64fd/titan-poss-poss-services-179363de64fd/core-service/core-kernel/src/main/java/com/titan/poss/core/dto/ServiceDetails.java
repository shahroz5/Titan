/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
* @author Mindtree Ltd.
* @version 1.0
*/
@Data
@EqualsAndHashCode(callSuper = false)
public class ServiceDetails extends BaseFieldsValidator implements Serializable {
	
	private Boolean isServiceMandatory;
	

}
