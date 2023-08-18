/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.io.File;

import com.titan.poss.file.dto.InvoiceStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface InvoiceValidationService {

	boolean validateFileColumnLength(File invFile);

	boolean validateIhdrService(InvoiceStageDto invoiceStageDto);

	boolean validateIdtlService(InvoiceStageDto invoiceStageDto);

	boolean validateLdtlService(InvoiceStageDto invoiceStageDto);

	boolean validateMdtlService(InvoiceStageDto invoiceStageDto);

}
