/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class BankDepositSummaryBaseDao extends SyncableEntity implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "denomination_details", columnDefinition = "nvarchar")
	private String denominationDetails;
	
}
