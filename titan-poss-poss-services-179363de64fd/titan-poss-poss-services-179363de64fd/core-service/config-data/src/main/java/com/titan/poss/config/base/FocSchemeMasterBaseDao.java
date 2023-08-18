/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.util.Date;

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
public class FocSchemeMasterBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "name")
	private String name;

	@Column(name = "description", columnDefinition = "nvarchar")
	private String description;

	@Column(name = "grn_config", columnDefinition = "nvarchar")
	private String grnConfig;

	@Column(name = "tep_config", columnDefinition = "nvarchar")
	private String tepConfig;

	@Column(name = "order_config", columnDefinition = "nvarchar")
	private String orderConfig;

	@Column(name = "clubbing_config", columnDefinition = "nvarchar")
	private String clubbingConfig;

	@Column(name = "manual_foc")
	private Boolean manualFoc;

	@Column(name = "publish_time")
	private Date publishTime;

	@Column(name = "is_publish_pending")
	private Boolean isPublishPending;
	
	@Column(name = "is_accrual_ulp")
	private Boolean isAccrualUlp;

}
