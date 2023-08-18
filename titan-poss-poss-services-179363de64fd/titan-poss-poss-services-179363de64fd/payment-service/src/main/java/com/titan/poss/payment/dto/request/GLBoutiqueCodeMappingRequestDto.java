/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.payment.dto.AddGLBoutiqueCode;
import com.titan.poss.payment.dto.UpdateGLBoutiqueCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class GLBoutiqueCodeMappingRequestDto {

    private List<AddGLBoutiqueCode> addPaymentCodes;

    private List<UpdateGLBoutiqueCode> updatePaymentCodes;
    
    private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

    private List<@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String> removePaymentCodes;

    private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;

}
