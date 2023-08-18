/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.util.StringUtils;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.DiscountConfigDetailsDao;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class to sync <b>discount_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountDetailsSyncDto extends SyncableEntity {

	private String id;

	private String discountConfig;

	private String salesTxn;

	private String refPayment;

	private String discountId;

	private String discountCode;

	private String discountType;

	private String discountSubType;

	private String applicableLevel;

	private BigDecimal discountValue;

	private String discountValueDetails;

	private String referenceId;

	private String referenceType;

	private String status;

	private Boolean isEdited;

	private Boolean isAutoApplied;

	private String reason;

	private String clubbedDiscountId;

	private String cumulativeDiscountId;

	private String linkedDiscountId;

	private String gepConfigDetailsId;

	private String rivaahCardDiscountId;

	public DiscountDetailsDao getDiscountDetailsDao(DiscountDetailsSyncDto discountDetailsSyncDto) {
		DiscountDetailsDao dao = (DiscountDetailsDao) MapperUtil.getObjectMapping(discountDetailsSyncDto,
				new DiscountDetailsDao());
		DiscountConfigDetailsDao config = new DiscountConfigDetailsDao();
		config.setId(discountDetailsSyncDto.getDiscountConfig());
		dao.setDiscountConfig(config);
		SalesTxnDao sales = new SalesTxnDao();
		sales.setId(discountDetailsSyncDto.getSalesTxn());
		dao.setSalesTxn(sales);
		if (!StringUtils.isEmpty(discountDetailsSyncDto.getRefPayment())) {
			PaymentDetailsDao payment = new PaymentDetailsDao();
			payment.setId(discountDetailsSyncDto.getRefPayment());
			dao.setRefPayment(payment);
		}

		return dao;
	}

	public List<DiscountDetailsDao> getDiscountDetailsDaoList(List<DiscountDetailsSyncDto> syncDtoList) {
		List<DiscountDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(sync -> daoList.add(getDiscountDetailsDao(sync)));
		return daoList;
	}

}
