/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.Date;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountSyncDto extends MasterSyncableEntity {

	private String id;

//	private String discount;

	private String discountCode;

	private String description;

	private String approvedBy;

	private String discountType;

	private String occasion;

	private String subBrandCode;

	private String brandCode;

	private Boolean isPreviewApplicable;

	private Boolean isAbOfferApplicable;

	private Boolean isCoOfferApplicable;

	private Boolean isRiva;

	private Boolean isAccrualUlp;

	private Date ulpCreateDate;

	private String cumulativeDetails;

	private String grnDetails;

	private String orderDetails;

	private String tepDetails;

	private String applicableLevels;

	private String remarks;

	private String basicCriteria;

	private String clubOtherOffersConfig;

	private String clubDiscountType;

	private String abCoData;

	private String configDetails;

	private String itemGroupConfig;

	private String rivaahItemGroupConfig;

	private String applicableThemes;

	private String clubbingDiscountType;

	private Boolean isPublishPending;

	private Date publishTime;

	private String finalStatus;

	private Boolean isCreatedByWorkflow;

	private String typeOfRequest;

	private String requestStatus;

	private Date approvedDate;

	private String workflowProcessId;
	
	private String workflowFileUploadDetails;

	public DiscountDao getDiscountDao(DiscountSyncDto discountSyncDto) {
		DiscountDao discountDao = new DiscountDao();
		discountDao = (DiscountDao) MapperUtil.getObjectMapping(discountSyncDto, discountDao);

//		if (discountSyncDto.getDiscount() != null) {
//			DiscountDao discountDao1 = new DiscountDao();
//			discountDao.setId(discountSyncDto.getDiscount());
//
//			discountDao.setDiscount(discountDao1);
//		} else {
//			discountDao.setDiscount(null);
//		}
		return discountDao;
	}
}
