/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO to carry Stock Request Item Data
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class IssueStockItemDto extends StockItemDto  implements Comparable<IssueStockItemDto> {
	private String inventoryId;
    private String refDocType;
    private Date refDocDate;
    private Short refFiscalYear;
    private Integer refDocNumber;
    private Boolean ishallmarking;
    
    @Override
    public int compareTo(IssueStockItemDto issuedItem) {
      return getRefDocDate().compareTo(issuedItem.getRefDocDate());
    }
    private BigDecimal karat;
    private BigDecimal finalValue;
    private BigDecimal totalTax;
   
	
}
