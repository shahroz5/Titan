/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
public class ExchangeConfigDetailsBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "deduction_percent", columnDefinition = "DECIMAL")
	private BigDecimal deductionPercent;

	@Column(name = "scheme_percent", columnDefinition = "DECIMAL")
	private BigDecimal schemePercent;

	@Temporal(TemporalType.DATE)
	@Column(name = "start_date")
	private Date startDate;

	@Temporal(TemporalType.DATE)
	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "metal_type")
	private String metalType;

	@Column(name = "item_type")
	private String itemType;
}
