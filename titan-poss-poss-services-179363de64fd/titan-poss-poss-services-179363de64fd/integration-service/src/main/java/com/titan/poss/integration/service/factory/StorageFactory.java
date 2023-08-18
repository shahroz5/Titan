/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.service.StorageService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class StorageFactory {

	private Map<String, StorageService> storageServiceBeans = new HashMap<>();

	public void registerStorageService(String storageType, StorageService storageService) {
		storageServiceBeans.put(storageType, storageService);
	}

	public StorageService getStorageService(String storageVendorCode) {

		if (storageServiceBeans.containsKey(storageVendorCode) && storageServiceBeans.get(storageVendorCode) != null) {
			return storageServiceBeans.get(storageVendorCode);
		}

		throw new ServiceException("Type is not registered for the storage type.", "ERR-CORE-047");
	}

}
