package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StockInvoiceIsacDetailsDto {
	
  private List<InvoiceIsacDetailsDto> IsacDetails;
  
}

