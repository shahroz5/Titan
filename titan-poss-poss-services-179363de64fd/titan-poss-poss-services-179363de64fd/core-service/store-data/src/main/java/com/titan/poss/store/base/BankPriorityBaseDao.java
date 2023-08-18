/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncTimeDao;

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
public class BankPriorityBaseDao extends SyncTimeDao implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "priority")
	private Integer priority;

	@Column(name = "location_code")
	private String locationCode;
}
