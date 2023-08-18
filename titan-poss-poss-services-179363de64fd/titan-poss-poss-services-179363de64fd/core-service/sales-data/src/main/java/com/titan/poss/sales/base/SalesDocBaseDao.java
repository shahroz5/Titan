/*  
 * Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.sales.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

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
public class SalesDocBaseDao extends MasterSyncableEntity implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "doc_type")
	private String docType;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "location_code")
	private String locationCode;
}
