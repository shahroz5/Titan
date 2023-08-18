/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BankDepositDao;
import com.titan.poss.sales.dao.BankDepositSummaryDao;
import com.titan.poss.sales.dao.BusinessDayDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BankDepositSyncDto extends SyncableEntity{
	
	private String id;
	
	private String businessDayDao;
	
    private Date collectionDate;

	private String paymentCode;

	private String locationCode;

	private String payerBankName;

	private String payeeBankName;

	private Date instrumentDate;
	
	private Date depositDate;
	
	private Date businessDate;

	private String instrumentNo;

	private BigDecimal amount;

	private BigDecimal openingBalance;

	private BigDecimal depositAmount;

	private String pifNo;
	
	private String midCode;

	private String depositDetails;

	private String approvalDetails;
	
	private Boolean isGhsIncluded;
	
	private Boolean isBankingCompleted;

	private String depositSlipNo;
	
	private String bankDepositSummaryDao;
	
	private String documentPath;
	
	public BankDepositDao getBankDepositDao(BankDepositSyncDto syncDto) {
		BankDepositDao dao=(BankDepositDao)MapperUtil.getObjectMapping(syncDto,new BankDepositDao());
		if(syncDto.getBankDepositSummaryDao()!=null) {
			BankDepositSummaryDao bankSummary=new BankDepositSummaryDao();
			bankSummary.setId(syncDto.getBankDepositSummaryDao());
			dao.setBankDepositSummaryDao(bankSummary);
		}
		BusinessDayDao bDay=new BusinessDayDao();
		bDay.setId(syncDto.getBusinessDayDao());
		dao.setBusinessDayDao(bDay);
		return dao;
	}
	public List<BankDepositDao> getBankDepositDaoList(List<BankDepositSyncDto> syncDtoList){
		List<BankDepositDao> daoList=new ArrayList<>();
		syncDtoList.forEach(syncDto->daoList.add(getBankDepositDao(syncDto)));
		return daoList;
	}
}
