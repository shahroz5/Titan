/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.service.StoreService;
import com.titan.poss.store.dao.PrinterConfigDao;
import com.titan.poss.store.dto.respond.PrinterConfigDto;
import com.titan.poss.store.repository.PrinterConfigRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("engineStoreService")
public class StoreServiceImpl implements StoreService {

	private static final String ERR_ENGINE_025 = "ERR-ENG-025";
	private static final String RECORD_NOT_FOUND = "No configuration found for the documentType : ";

	@Autowired
	private PrinterConfigRepository printerConfigRepository;

	@Override
	public PrinterConfigDto getPrinterConfigService(String documentType) {
		PrinterConfigDao printerConfigDao = printerConfigRepository
				.findByDocumentTypeAndLocationCodeAndHostnameAndIsActive(documentType, CommonUtil.getLocationCode(),
						CommonUtil.getAuthUser().getHostName(), Boolean.TRUE);
		if (printerConfigDao != null) {
			return (PrinterConfigDto) MapperUtil.getDtoMapping(printerConfigDao, PrinterConfigDto.class);
		}
		Map<String, String> dynamicValue=Map.of("documentType", documentType);
		throw new ServiceException(RECORD_NOT_FOUND, ERR_ENGINE_025,dynamicValue);
	}

}
