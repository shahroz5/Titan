/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.NetcarrotsService;
import com.titan.poss.integration.service.UlpService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ULPFactory {

	@Autowired
	private NetcarrotsService netCarrotService;
	
	public UlpService getUlpService(VendorDao vendor) {
		UlpService ulpService = null;
		if (vendor.getVendorCode().equalsIgnoreCase("ULP_NETCARROTS")) {
			ulpService = netCarrotService;
		} else {
			throw new ServiceException("Type is not registered", "ERR-INT-001", vendor.getVendorCode());
		}
		return ulpService;
	}
}
