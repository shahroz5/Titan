/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackDao;
import com.titan.poss.payment.dao.CashbackOfferDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackOfferDetailsSyncDto extends SyncTimeDao {
	
	private static final long serialVersionUID = 1L;

	private BigDecimal minSwipeAmt;

	
	private BigDecimal maxSwipeAmt;

	
	private BigDecimal minInvoiceAmt;

	
	private BigDecimal maxInvoiceAmt;

	
	private BigDecimal discountAmt;

	
	private BigDecimal discountPercent;

	
	private BigDecimal maxDiscountAmt;


	private Integer rowId;
	
	private String id;
	
	private String cashbackDao;
	
	public CashbackOfferDetailsDao getCashbackOfferDao(CashbackOfferDetailsSyncDto cashbackOfferDetailsSyncDto) {
		CashbackOfferDetailsDao cashbackOfferDetailsDao = ( CashbackOfferDetailsDao)MapperUtil.getObjectMapping(cashbackOfferDetailsSyncDto,new  CashbackOfferDetailsDao()); 
		CashbackDao cashbaackDao=new CashbackDao();
		cashbaackDao.setId(cashbackOfferDetailsSyncDto.getCashbackDao());
		cashbackOfferDetailsDao.setCashbackDao(cashbaackDao);
		return cashbackOfferDetailsDao; 
	}
}
