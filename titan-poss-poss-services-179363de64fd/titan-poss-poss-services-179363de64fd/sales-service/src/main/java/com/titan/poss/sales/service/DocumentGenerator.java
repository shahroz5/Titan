/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;

/**
 * Service interface for Document Generation
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface DocumentGenerator {

	/**
	 * @param productCode
	 * 
	 */
	PrintableDto getPrintableDto(String txnId, String productCode);

	/**
	 * @return
	 */
	PrintableDto getDto();
	
	PrintableDto getPrintableto(PrintRequestDto printRequest);

}
