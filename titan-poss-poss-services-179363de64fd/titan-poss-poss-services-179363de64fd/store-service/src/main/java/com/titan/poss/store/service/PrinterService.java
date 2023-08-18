/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.store.dto.request.CreatePrinterConfigDto;
import com.titan.poss.store.dto.request.UpdatePrinterConfigDto;
import com.titan.poss.store.dto.respond.PrinterConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("StorePrinterService")
public interface PrinterService {

	/**
	 * @param documentType
	 * @param pageable
	 * @param isActive 
	 * @return
	 */
	PagedRestResponse<List<PrinterConfigDto>> listPrinterConfigService(String documentType, Pageable pageable, Boolean isActive);

	/**
	 * @param id
	 * @return
	 */
	PrinterConfigDto getPrinterConfigService(String id);

	/**
	 * @param createDto
	 * @return
	 */
	PrinterConfigDto createPrinterConfigService(CreatePrinterConfigDto createDto);

	/**
	 * @param updateDto
	 * @return
	 */
	PrinterConfigDto updatePrinterConfigService(UpdatePrinterConfigDto updateDto);

}
