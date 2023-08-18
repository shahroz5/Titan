/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackDao;
import com.titan.poss.payment.dao.CashbackProductMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackProductMappingSyncDto extends SyncTimeDao{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String productGroupCode;
	
	private String id;
	
	private String cashbackDao;
	
	public CashbackProductMappingDao getCashbackProductMappingDao(CashbackProductMappingSyncDto cashbackProductMappingSyncDto) {
		CashbackProductMappingDao cashbackProductMappingDao = (CashbackProductMappingDao)MapperUtil.getObjectMapping(cashbackProductMappingSyncDto,new CashbackProductMappingDao()); 
		CashbackDao cashbaackDao=new CashbackDao();
		cashbaackDao.setId(cashbackProductMappingSyncDto.getCashbackDao());
		cashbackProductMappingDao.setCashbackDao(cashbaackDao);
		return cashbackProductMappingDao; 
	}
}
