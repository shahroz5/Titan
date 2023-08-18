/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class OfferDetails extends BaseFieldsValidator implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Double maxWeightforFOC;
	private Double maxValueforFOC;
	private Boolean bintobintransferallowedforFOCitems;
	private Boolean isTEPsaleableitemsallowedforFOC;
	private Boolean isTEPallowedforFOCitems;
	private Boolean isFOCitemssaleable;
	private Boolean isEmployeeDiscount;

}
