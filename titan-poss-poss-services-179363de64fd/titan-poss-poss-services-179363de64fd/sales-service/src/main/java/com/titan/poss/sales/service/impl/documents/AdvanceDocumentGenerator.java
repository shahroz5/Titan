/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.documents;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.print.CnGrfLiteDto;
import com.titan.poss.sales.dto.print.MergedCnGrfLiteDto;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepositoryExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public abstract class AdvanceDocumentGenerator extends SalesDocumentGenerator {

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private CustomerRepositoryExt customerRepo;

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";
	private static final String ERR_CORE_039 = "ERR-CORE-039";

	protected SalesTxnDao getRateFrozenSalesTxn(String txnId) {

		SalesTxnDao st = getSalesTxn(txnId, CommonUtil.getStoreCode());
		if (!st.getSubTxnType().equals(SubTxnTypeEnum.FROZEN_RATES.name())
				&& !st.getSubTxnType().equals(SubTxnTypeEnum.MANUAL_FROZEN_RATES.name()))
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039, st.getSubTxnType());
		return st;

	}

	protected CnGrfLiteDto getCnGenerated(String txnId) {
		CreditNoteDaoExt cnDao = creditNoteRepo.findOneBySalesTxnId(txnId);
		return mapCNDaoToDto(cnDao);
	}

	private static CnGrfLiteDto mapCNDaoToDto(CreditNoteDaoExt cnDao) {
		JsonData frJd = MapperUtil.mapObjToClass(cnDao.getFrozenRateDetails(), JsonData.class);
		CnGrfLiteDto cnLite = (CnGrfLiteDto) MapperUtil.getDtoMapping(cnDao, CnGrfLiteDto.class);
		cnLite.setFrd(frJd);
		return cnLite;
	}

	protected List<MergedCnGrfLiteDto> getMergedCnList(CnGrfLiteDto cnNew) {
		List<CreditNoteDaoExt> mergedCnsDao = creditNoteRepo.findAllByMergedCNId(cnNew.getId());
		List<MergedCnGrfLiteDto> mergedCns = mergedCnsDao.stream().map(cnDao -> {

			JsonData frJd = MapperUtil.mapObjToClass(cnDao.getFrozenRateDetails(), JsonData.class);
			MergedCnGrfLiteDto cnLite = (MergedCnGrfLiteDto) MapperUtil.getDtoMapping(cnDao, MergedCnGrfLiteDto.class);
			cnLite.setFrd(frJd);
			cnLite.setDocDateStr(CalendarUtils.formatToPrintableDate(cnDao.getDocDate()));
			return cnLite;
		}).collect(Collectors.toList());

		Map<Integer, String> customerDetails = getCustomerNameWithId(mergedCnsDao);
		for (MergedCnGrfLiteDto cn : mergedCns) {
			String customerName = customerDetails.get(cn.getCustomerId());
			cn.setCustomerName(customerName);
		}

		return mergedCns;
	}

	private Map<Integer, String> getCustomerNameWithId(List<CreditNoteDaoExt> mergedCnsDao) {
		Set<Integer> customerIds = mergedCnsDao.stream().map(CreditNoteDaoExt::getCustomerId)
				.collect(Collectors.toSet());
		List<Object[]> customerDetailsRes = customerRepo.getCustomerNamesByIds(CommonUtil.getLocationCode(),
				customerIds);
		Map<Integer, String> customerDetails = new HashMap<>();
		for (Object[] object : customerDetailsRes) {
			customerDetails.put((Integer) object[0], CryptoUtil.decrypt((String) object[1], "customerName", false));
		}
		return customerDetails;
	}
}
