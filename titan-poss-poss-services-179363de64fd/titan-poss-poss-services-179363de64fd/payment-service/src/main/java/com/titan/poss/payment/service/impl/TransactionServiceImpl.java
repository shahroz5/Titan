/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.payment.constants.TransactionSearchTypeEnum;
import com.titan.poss.payment.dao.TransactionDao;
import com.titan.poss.payment.dto.response.TransactionResponseDto;
import com.titan.poss.payment.repository.TransactionRepository;
import com.titan.poss.payment.service.TransactionService;

/**
 * Service class for transaction master.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("paymentTransactionService")
public class TransactionServiceImpl implements TransactionService {

	@Autowired
	private TransactionRepository transactionRepository;

	@Override
	public PagedRestResponse<List<TransactionResponseDto>> listTransactionTypes(String searchType, Boolean isTrue,
			String transactionType, Pageable pageable, Boolean isPageable) {

		if (BooleanUtils.isFalse(isPageable)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		// if searchType is selected, but isTrue is not selected.
		if (!StringUtils.isEmpty(searchType) && isTrue == null) {
			isTrue = true;
		}

		TransactionDao transactionDaoCriteria = new TransactionDao();
		transactionDaoCriteria.setTransactionType(transactionType);

		// add criteria based on search type
		if (TransactionSearchTypeEnum.MANUAL_BILL_ALLOWED.name().equals(searchType)) {
			transactionDaoCriteria.setManualBillAllowed(isTrue);
		} else if (TransactionSearchTypeEnum.PAYMENT_MAPPING.name().equals(searchType)) {
			transactionDaoCriteria.setPaymentMapping(isTrue);
		} else if (TransactionSearchTypeEnum.CUSTOMER_MAPPING.name().equals(searchType)) {
			transactionDaoCriteria.setCustomerMapping(isTrue);
		}

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<TransactionDao> example = Example.of(transactionDaoCriteria, matcher);

		Page<TransactionDao> transactionDaoList = transactionRepository.findAll(example, pageable);

		if (transactionDaoList == null) {
			return new PagedRestResponse<>();
		}

		List<TransactionResponseDto> transactionDtoList = new ArrayList<>();
		transactionDaoList.forEach(transactionDao -> {
			TransactionResponseDto transactionResponseDto = new TransactionResponseDto(
					transactionDao.getTransactionType(), transactionDao.getDescription());
			transactionDtoList.add(transactionResponseDto);
		});

		return new PagedRestResponse<>(transactionDtoList, transactionDaoList);
	}

	@Override
	public List<String> getTransactionTypes(String searchType, Boolean isTrue) {

		PagedRestResponse<List<TransactionResponseDto>> txnPagedResponse = listTransactionTypes(searchType, isTrue,
				null, PageRequest.of(0, Integer.MAX_VALUE), false);

		if (CollectionUtil.isEmpty(txnPagedResponse.getResults())) {
			new ArrayList<>();
		}

		return txnPagedResponse.getResults().stream().map(TransactionResponseDto::getTransactionType)
				.collect(Collectors.toList());

	}

}
