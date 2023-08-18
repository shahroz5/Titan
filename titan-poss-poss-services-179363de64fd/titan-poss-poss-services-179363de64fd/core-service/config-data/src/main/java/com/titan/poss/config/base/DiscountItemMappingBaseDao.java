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
public class DiscountItemMappingBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "preview_start_date")
	private Date previewStartDate;

	@Column(name = "preview_end_date")
	private Date previewEndDate;

	@Column(name = "is_transferred_location")
	private Boolean isTransferredLocation;

	@Column(name = "is_preview_applicable")
	private Boolean isPreviewApplicable;

	@Column(name = "regular_config_details", columnDefinition = "nvarchar")
	private String regularConfigDetails;

	@Column(name = "preview_config_details", columnDefinition = "nvarchar")
	private String previewConfigDetails;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;

}
