package com.titan.poss.core.dto;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for cash payment details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalCashPaidDetailsDto {
	
	private BigDecimal totalCashPaid;
	private String mobileNumber;

}
