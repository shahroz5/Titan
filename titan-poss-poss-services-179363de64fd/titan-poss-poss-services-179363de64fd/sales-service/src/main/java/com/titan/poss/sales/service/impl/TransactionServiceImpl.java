/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dto.response.TransactionDetailsDto;
import com.titan.poss.sales.dto.response.TransactionStatusCountDto;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.TransactionService;

/**
 * Service class for Transaction.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesTransactionService")
public class TransactionServiceImpl implements TransactionService {

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	/**
	 * This method will return the count of transaction based on status.
	 * 
	 * @param transactionType
	 * @param status
	 * @param subTxnType
	 * @return ListResponse<TransactionStatusCountDto>
	 */
	@Transactional(readOnly = true)
	@Override
	public ListResponse<TransactionStatusCountDto> getCountOfTransaction(String transactionType, String status,
			String subTxnType) {

		Set<String> txnTypes = new HashSet<>();

		if (StringUtils.isEmpty(transactionType)) {

			TransactionTypeEnum[] txnEnums = TransactionTypeEnum.values();
			for (int i = 0; i < txnEnums.length; i++) {
				txnTypes.add(txnEnums[i].name());
			}

		} else {
			txnTypes = Set.of(TransactionTypeEnum.valueOf(transactionType).name());
		}

		return new ListResponse<>(
				salesTxnRepository.listTransactions(txnTypes, status, CommonUtil.getLocationCode(), subTxnType));
	}

	/**
	 * This method will return transaction details.
	 * 
	 * @param transactionType
	 * @param docNo
	 * @param customerName
	 * @param status
	 * @param subTxnType
	 * @param pageable
	 * @return PagedRestResponse<List<TransactionDetailsDto>>
	 */
	@Transactional(readOnly = true)
	@Override
	public PagedRestResponse<List<TransactionDetailsDto>> getTransactionDetails(String transactionType, Integer docNo,
			Short fiscalYear, String customerName, String mobileNumber, String status, String subTxnType,
			Pageable pageable) {

		Page<TransactionDetailsDto> transactionDetailsDtoList;
		if (transactionType.equals("TEP") && status.equals("CONFIRMED") && subTxnType.equals("NEW_TEP")) {
			transactionDetailsDtoList = salesTxnRepository.listTxnDetails(
					StringUtils.isEmpty(transactionType) ? null : TransactionTypeEnum.valueOf(transactionType).name(),
					docNo, fiscalYear, CryptoUtil.encrypt(customerName, SalesConstants.CUSTOMER_NAME),
					CryptoUtil.encrypt(mobileNumber, SalesConstants.MOBILE_NO), status, CommonUtil.getLocationCode(),
					subTxnType, pageable, transactionType);
		} else {
			transactionDetailsDtoList = salesTxnRepository.listTxnDetails(
					StringUtils.isEmpty(transactionType) ? null : TransactionTypeEnum.valueOf(transactionType).name(),
					docNo, fiscalYear, CryptoUtil.encrypt(customerName, SalesConstants.CUSTOMER_NAME),
					CryptoUtil.encrypt(mobileNumber, SalesConstants.MOBILE_NO), status, CommonUtil.getLocationCode(),
					subTxnType, pageable);
		}

		// decrypt customer name and mobile number
		transactionDetailsDtoList.getContent().forEach(txnDto -> {
			txnDto.setCustomerName(CryptoUtil.decrypt(txnDto.getCustomerName(), SalesConstants.CUSTOMER_NAME, false));
			txnDto.setMobileNumber(CryptoUtil.decrypt(txnDto.getMobileNumber(), SalesConstants.MOBILE_NO, false));
		});

		return new PagedRestResponse<>(transactionDetailsDtoList.getContent(), transactionDetailsDtoList);

	}

}
