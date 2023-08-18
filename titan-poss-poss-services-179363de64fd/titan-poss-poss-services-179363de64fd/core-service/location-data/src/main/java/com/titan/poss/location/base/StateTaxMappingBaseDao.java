/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.location.dao.StateDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class StateTaxMappingBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@OneToOne(fetch = FetchType.LAZY, orphanRemoval = true)
	@JoinColumn(name = "state_id", referencedColumnName = "state_id", unique = true)
	private StateDao state;

	@Column(name = "tax_component", columnDefinition = "NVARCHAR")
	private String taxComponent;

	@Column(name = "state_tax_code")
	private String stateTaxCode;

	@Column(name = "is_active")
	private Boolean isActive;
}
