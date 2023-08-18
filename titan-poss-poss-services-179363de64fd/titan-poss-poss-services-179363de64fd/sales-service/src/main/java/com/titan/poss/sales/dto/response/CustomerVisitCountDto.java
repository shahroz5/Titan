package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerVisitCountDto {

	private Date date;

	private Integer purchasers;

	private Integer invoices;
}
