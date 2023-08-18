/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import org.springframework.stereotype.Service;

import com.titan.poss.store.dto.respond.PrinterConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("EngineStoresService")
public interface StoreService {

	/**
	 * @param documentType
	 * @return
	 */
	PrinterConfigDto getPrinterConfigService(String documentType);

}
