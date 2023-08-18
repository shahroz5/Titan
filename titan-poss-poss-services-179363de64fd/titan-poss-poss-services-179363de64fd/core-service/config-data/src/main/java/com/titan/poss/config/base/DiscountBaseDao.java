/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

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
public class DiscountBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "discount_code")
	private String discountCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "approved_by")
	private String approvedBy;

	@Column(name = "discount_type")
	private String discountType;

	@Column(name = "occasion")
	private String occasion;

	@Column(name = "sub_brand_code")
	private String subBrandCode;

	@Column(name = "brand_code")
	private String brandCode;

	@Column(name = "is_preview_applicable")
	private Boolean isPreviewApplicable;

	@Column(name = "is_ab_offer_applicable")
	private Boolean isAbOfferApplicable;

	@Column(name = "is_co_offer_applicable")
	private Boolean isCoOfferApplicable;

	@Column(name = "is_riva")
	private Boolean isRiva;

	@Column(name = "is_accrual_ulp")
	private Boolean isAccrualUlp;

	@Column(name = "ulp_create_date")
	private Date ulpCreateDate;

	@Column(name = "cumulative_details", columnDefinition = "nvarchar")
	private String cumulativeDetails;

	@Column(name = "grn_details", columnDefinition = "nvarchar")
	private String grnDetails;

	@Column(name = "order_details", columnDefinition = "nvarchar")
	private String orderDetails;

	@Column(name = "tep_details", columnDefinition = "nvarchar")
	private String tepDetails;

	@Column(name = "applicable_levels")
	private String applicableLevels;

	@Column(name = "remarks")
	private String remarks;

	@Column(name = "basic_criteria", columnDefinition = "nvarchar")
	private String basicCriteria;

	@Column(name = "club_other_offers_config", columnDefinition = "nvarchar")
	private String clubOtherOffersConfig;

	@Column(name = "club_discount_type", columnDefinition = "nvarchar")
	private String clubDiscountType;

	@Column(name = "ab_co_data", columnDefinition = "nvarchar")
	private String abCoData;

	@Column(name = "config_details", columnDefinition = "nvarchar")
	private String configDetails;

	@Column(name = "item_group_config", columnDefinition = "nvarchar")
	private String itemGroupConfig;

	@Column(name = "rivaah_item_group_config", columnDefinition = "nvarchar")
	private String rivaahItemGroupConfig;

	@Column(name = "applicable_themes", columnDefinition = "nvarchar")
	private String applicableThemes;

	@Column(name = "clubbing_discount_type")
	private String clubbingDiscountType;

	@Column(name = "is_publish_pending")
	private Boolean isPublishPending;

	@Column(name = "publish_time")
	private Date publishTime;

	@Column(name = "final_status")
	private String finalStatus;

	@Column(name = "is_created_by_workflow")
	private Boolean isCreatedByWorkflow;

	@Column(name = "type_of_request")
	private String typeOfRequest;

	@Column(name = "request_status")
	private String requestStatus;

	@Column(name = "approved_date")
	private Date approvedDate;

	@Column(name = "workflow_process_id", columnDefinition = "uniqueidentifier")
	private String workflowProcessId;
	
	@Column(name = "workflow_fileupload_details", columnDefinition = "nvarchar")
	private String workflowFileUploadDetails;

	@PrePersist
	private void onPrePersist2() {

		if (this.getIsCreatedByWorkflow() == null) {
			this.setIsCreatedByWorkflow(false);
		}

	}

}
