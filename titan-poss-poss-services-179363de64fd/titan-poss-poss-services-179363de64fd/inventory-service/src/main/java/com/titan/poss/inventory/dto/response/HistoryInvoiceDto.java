/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

//import java.math.BigDecimal;

import com.titan.poss.core.dto.StoreDetails;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class HistoryInvoiceDto extends StockDto {

	private String invoiceType;
	private String remarks;
	private Short destFiscalyear;
	private Object carrierDetails;
	private StoreDetails srcDetails;
	private StoreDetails destDetails;
	// private BigDecimal finalValue;
	// private BigDecimal totalTax;
	private Boolean filePublish;
	private BigDecimal totalValue;

}
