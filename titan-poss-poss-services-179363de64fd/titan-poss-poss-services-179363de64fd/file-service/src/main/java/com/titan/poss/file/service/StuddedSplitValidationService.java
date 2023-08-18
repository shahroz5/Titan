/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.io.File;
import java.util.List;

import com.titan.poss.file.dto.StuddedSplitDtlDto;
import com.titan.poss.file.dto.StuddedSplitLdtlDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface StuddedSplitValidationService {
	
	boolean validateFileColumnLength(File studdedSplitFile);

	boolean validateDtlDto(StuddedSplitDtlDto dtlDto);

	boolean validateLdtlDto(StuddedSplitLdtlDto ldtlDto);
	
	boolean validateDtlWeights(List<StuddedSplitDtlDto> dtlDtos);

}
