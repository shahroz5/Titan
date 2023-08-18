/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.io.File;

import com.titan.poss.file.dto.StnStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface StnValidationService {

	boolean validateFileColumnLength(File stnFile);

	boolean validateHdrService(StnStageDto stnStageDto);

	boolean validateDtlService(StnStageDto stnStageDto);

	boolean validateLdtlService(StnStageDto stnStageDto);

	boolean validateMdtlService(StnStageDto stnStageDto);
}
