/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

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
public class ReturnInvoiceItemDto extends StockItemDto {
	private String remarks;
	private String inventoryId;
	private String refDocType;
	private Date refDocDate;
	private Short refFiscalYear;
	private Integer refDocNumber;
	private Boolean ishallmarking;
	private BigDecimal karat;
	private BigDecimal totalTax;
	private BigDecimal finalValue;
	private Object isacDetails;
    private BigDecimal value;
    private BigDecimal pricePerUnit;
    private BigDecimal preTaxValue;

}
