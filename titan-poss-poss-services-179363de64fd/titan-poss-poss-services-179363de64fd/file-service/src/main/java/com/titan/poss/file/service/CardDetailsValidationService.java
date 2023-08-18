/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.file.dto.CardDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CardDetailsValidationService {

	boolean dataValidation(CardDetailsDto item);

}
