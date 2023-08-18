/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayerBankLocationMapping {
	
    private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

    private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;
    
    private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> overwriteLocations;

}
