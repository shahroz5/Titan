/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
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
public class DiscountLocationMappingBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "location_code")
	private String locationCode;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "offer_start_date")
	private Date offerStartDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "offer_end_date")
	private Date offerEndDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "preview_start_date")
	private Date previewStartDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "preview_end_date")
	private Date previewEndDate;

	@Column(name = "config_details", columnDefinition = "nvarchar")
	private String configDetails;

}
