/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import com.titan.poss.core.dto.FocSchemeIndividualDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ConfigFocService {

	/**
	 * @param schemeId
	 * @return
	 */
	FocSchemeIndividualDto getFocSchemeConfigById(String schemeId);

	FocSchemeIndividualDto getFocSchemeDetails(String schemeId, String productGroup);

}
