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
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class HistoryInvoiceItemDto extends StockItemDto {

	private String remarks;
	private Object isacDetails;
	private BigDecimal finalValue;
	private BigDecimal totalTax;
    private BigDecimal value;
    private BigDecimal pricePerUnit;
    private BigDecimal preTaxValue;
    private String refDocType;
	private Date refDocDate;
	private Short refFiscalYear;
	private Integer refDocNumber;
    private BigDecimal karatage;
}
