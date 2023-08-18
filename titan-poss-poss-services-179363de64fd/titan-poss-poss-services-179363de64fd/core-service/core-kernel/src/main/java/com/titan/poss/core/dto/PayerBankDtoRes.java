package com.titan.poss.core.dto;



import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PayerBankDtoRes {
	
	private String bankName;
	
	private Boolean isActive;
	
	private Date createdDate;
	
	private Date lastModifiedDate;
	
	private String createdBy;
	
	private String lastModifiedBy;
	
	private String locationCode;
	
	

}
