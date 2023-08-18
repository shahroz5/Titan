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
public class ExchangeConfigMasterBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "is_offer_enabled")
	private Boolean isOfferEnabled;

	@Column(name = "offer_details", columnDefinition = "NVARCHAR")
	private String offerDetails;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "config_type")
	private String configType;

	@Column(name = "item_code")
	private String itemCode;

	@Temporal(TemporalType.DATE)
	@Column(name = "start_date")
	private Date startDate;

	@Temporal(TemporalType.DATE)
	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;

}
