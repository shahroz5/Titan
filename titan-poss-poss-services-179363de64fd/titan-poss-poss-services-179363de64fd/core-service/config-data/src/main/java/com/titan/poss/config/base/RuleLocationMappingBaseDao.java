/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.config.dao.RuleMasterDao;
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
public class RuleLocationMappingBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rule_type", referencedColumnName = "rule_type")
	@JoinColumn(name = "rule_id", referencedColumnName = "rule_id")
	public RuleMasterDao ruleMasterDao;

	@Column(name = "location_code")
	private String locationCode;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "offer_start_date")
	private Date offerStartDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "offer_end_date")
	private Date offerEndDate;
}
