/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PurchaseInvoiceDto extends StockDto {
	private String invoiceType;
	private String receivedRemarks;
	private Object carrierDetails;
	private BigDecimal totalValue;
	private BigDecimal totalTax;
}
