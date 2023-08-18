/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.GiftCardService;
import com.titan.poss.integration.service.impl.QwikCilverGiftCardServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftCardFactory {

	@Autowired
	private QwikCilverGiftCardServiceImpl qcGiftCardService;

	public GiftCardService getGiftCardService(VendorDao vendor) {
		if (vendor.getVendorCode().equalsIgnoreCase(VendorCodeEnum.QC_GC.toString())) {
			return qcGiftCardService;
		} else {
			throw new ServiceException("Type is not registered", "ERR-INT-001", vendor.getVendorCode());
		}
	}
}
