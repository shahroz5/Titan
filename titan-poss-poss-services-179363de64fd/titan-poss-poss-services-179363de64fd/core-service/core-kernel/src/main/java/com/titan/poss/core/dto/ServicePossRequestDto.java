package com.titan.poss.core.dto;

import java.util.Date;

import lombok.Data;

/**
 * DTO class for request structure of stock Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ServicePossRequestDto {
	
	private String locationCode;
	
	private Long businessDate;

}
