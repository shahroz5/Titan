/*  Copyright 2019. Titan Company Limited
	*  All rights reserved.
	*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class ReturnInvoicePrintHeader extends InventoryHeader {

	// for stock issues
	private String invoiceType;
	private Object carrierDetails;
	private Integer srcDocNo;
	private Short srcFiscalYear;
	private Date srcDocDate;
	private String srcDate;
	private String srcLocationCode;
	private String destLocationCode;
	private String taxHeader;
	private BigDecimal totalTax;
	private BigDecimal totalDiscount;
	private BigDecimal totalTaxableAmount;
}
