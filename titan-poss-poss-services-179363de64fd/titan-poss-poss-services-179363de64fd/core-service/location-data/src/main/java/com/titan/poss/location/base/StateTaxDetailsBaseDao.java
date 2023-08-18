/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dao.TaxClassDao;

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
public class StateTaxDetailsBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "state_tax_mapping_id", referencedColumnName = "id")
	private StateTaxMappingDao stateTaxMappingId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tax_class_code", referencedColumnName = "tax_class_code")
	private TaxClassDao taxClassCode;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;
}
