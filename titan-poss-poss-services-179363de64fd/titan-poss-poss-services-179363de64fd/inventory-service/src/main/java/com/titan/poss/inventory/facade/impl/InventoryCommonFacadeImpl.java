/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.facade.impl;

import org.springframework.stereotype.Service;

import com.titan.poss.inventory.dto.InventoryPrint;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class InventoryCommonFacadeImpl {
	/**
	 * @param inventoryPrint
	 */
	void nullCheckForMandatoryFields(InventoryPrint inventoryPrint) {
		String defaultValue = "";
		if (inventoryPrint.getSrcLocationData().getBoutiqueEmailId() == null) {
			inventoryPrint.getSrcLocationData().setBoutiqueEmailId(defaultValue);
		}
		if (inventoryPrint.getDestLocationData().getBoutiqueEmailId() == null) {
			inventoryPrint.getDestLocationData().setBoutiqueEmailId(defaultValue);
		}
		if (inventoryPrint.getSrcLocationData().getGstId() == null) {
			inventoryPrint.getSrcLocationData().setGstId(defaultValue);
		}
		if (inventoryPrint.getDestLocationData().getGstId() == null) {
			inventoryPrint.getDestLocationData().setGstId(defaultValue);
		}
		if (inventoryPrint.getDestLocationData().getDescription() == null) {
			inventoryPrint.getDestLocationData().setDescription(defaultValue);
		}

	}
}
