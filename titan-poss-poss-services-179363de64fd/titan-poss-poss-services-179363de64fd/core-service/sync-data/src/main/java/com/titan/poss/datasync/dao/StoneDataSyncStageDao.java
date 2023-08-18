/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "stone_master_datasync_stage")
@EqualsAndHashCode(callSuper = false)
public class StoneDataSyncStageDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "stone_code")
	private String stoneCode;

	@Column(name = "color")
	private String color;

	@Column(name = "std_weight", columnDefinition = "decimal")
	private BigDecimal stdWeight;

	@Column(name = "stone_type_code")
	private String stoneType;

	@Column(name = "quality")
	private String quality;

	@Column(name = "shape")
	private String shape;

	@Column(name = "std_value", columnDefinition = "decimal")
	private BigDecimal stdValue;

	@Column(name = "rate_per_carat", columnDefinition = "decimal")
	private BigDecimal ratePerCarat;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "config_details", columnDefinition = "nvarchar")
	private String configDetails;

	@Column(name = "transfer_type")
	private String transferType;
	
	@Column(name = "is_active")
	private Boolean isActive;

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "created_date")
	private Date createdDate;

	@Column(name = "last_modified_by")
	private String lastModifiedBy;

	@Column(name = "last_modified_date")
	private Date lastModifiedDate;
	
	@PrePersist
	private void onPrePersist() {
		if (this.getSrcSyncId() == null && this.getDestSyncId() == null) {
			this.setSrcSyncId(0);
			this.setDestSyncId(0);
		}
		if (this.getIsActive() == null) {
			this.setIsActive(true);
		}

	}
}
