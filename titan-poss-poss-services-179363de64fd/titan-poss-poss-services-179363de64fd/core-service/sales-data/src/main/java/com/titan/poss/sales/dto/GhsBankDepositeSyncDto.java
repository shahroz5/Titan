/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GhsBankDepositDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GhsBankDepositeSyncDto extends SyncableEntity{
	
	private String type;
	
	private String id;
	
	private String bankName;

	private String chequeNo;

	private Date chequeDate;

	private BigDecimal grossAmount;

	private BigDecimal commision;

	private Integer pifNo;

	private Date depositSlipDate;

	private Date collectionDate;

	private String locationCode;

	private Date businessDate;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private String tranId;

	private String midCode;

	private String payeeBankName;

	private BigDecimal collectedAmount;

	private BigDecimal totalCollectedAmount;
	
	public GhsBankDepositDao getGhsBankDepositeDao(GhsBankDepositeSyncDto syncDto) {
		return (GhsBankDepositDao)MapperUtil.getObjectMapping(syncDto, new GhsBankDepositDao()); 
	}
	
	public List<GhsBankDepositDao> getGhsBankDepositeDaoList(List<GhsBankDepositeSyncDto> syncDto) {
		List<GhsBankDepositDao> daoList=new ArrayList<>();
		syncDto.forEach(sync->daoList.add(getGhsBankDepositeDao(sync)));
		return daoList; 
	}
	
}
