package com.titan.poss.core.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashMemoFetchDto {
	
	private Integer cashMemoNo;
	
	private String LocationCode;
	
	private Short fiscalYear;

}
