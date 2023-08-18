/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class InventoryPrint {

	private String txnTypeDetail;

	private StockIssuePrintHeader stockIssuePrintHeader;

	private ReturnInvoicePrintHeader returnInvoicePrintHeader;

	private OtherIssuePrintHeader otherIssuePrintHeader;

	private List<InventoryChild> inventoryChildList;

	// for both from and to in Otherissue
	// for srclocation in stockissue
	// for srclocation in returninvoice
	private StorePrintDetailsDto srcLocationData;

	private StorePrintDetailsDto destLocationData;

	private JsonNode courierData;

	private String totalPrice;

	private String currency; // rupees, dollar
	private String remarks;
	private String priceInWords;
	
	private String lockNumber;
	
	private String approvalCode;
	
	private String document;
}
