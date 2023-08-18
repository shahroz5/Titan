/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dto.PayerBankDto;
import com.titan.poss.payment.dto.PayerBankSyncDto;
import com.titan.poss.payment.dto.request.PayerBankUpdate;
import com.titan.poss.payment.repository.PayerBankConfigRepositoryExt;
import com.titan.poss.payment.repository.PayerBankRepository;
import com.titan.poss.payment.repository.PayerDetailsRepositoryExt;
import com.titan.poss.payment.service.PayerBankService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYER_BANK_SERVICE_IMPL)
public class PayerBankServiceImpl implements PayerBankService {

	@Autowired
	private PayerBankRepository payerBankRepository;

	@Autowired
	private PayerBankServiceImpl payerBankService;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Autowired
	PayerBankConfigRepositoryExt payerConfigRepository;

	@Autowired
	PayerDetailsRepositoryExt payerDetailsRepository;

	/**
	 * This method will return the list of payer bank based on the isActive.
	 *
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List < PayerBankDto>>
	 */
	@Override
	public PagedRestResponse<List<PayerBankDto>> listPayerBank(Boolean isActive, Pageable pageable, String bankName,
			Boolean isCashBack) {

		/*
		 * PayerBankDao payerBankCriteria = new PayerBankDao();
		 * payerBankCriteria.setIsActive(isActive);
		 * payerBankCriteria.setBankName(bankName);
		 * 
		 * ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		 * Example<PayerBankDao> criteria = Example.of(payerBankCriteria, matcher);
		 */
		List<PayerBankDto> payerBankDtoList = new ArrayList<>();
		Page<String> bankNames = null;
		if (BooleanUtils.isTrue(isCashBack)) {
			List<String> paymentConfigIds = payerConfigRepository.getCashBackConfigIds();
			if (!CollectionUtils.isEmpty(paymentConfigIds)) {
				bankNames = payerDetailsRepository.getAllBankNames(paymentConfigIds, pageable);
				if (bankNames != null && !bankNames.isEmpty()) {
					bankNames.forEach(config -> {
						PayerBankDto payerBankDto = new PayerBankDto();
						payerBankDto.setBankName(config);
						payerBankDto.setIsActive(Boolean.TRUE);
						payerBankDtoList.add(payerBankDto);
					});
				}
			}
			return (new PagedRestResponse<>(payerBankDtoList, bankNames));
		}
		Page<PayerBankDao> payerBankList = payerBankRepository.findPayeeBankName(isActive, pageable, bankName);

		payerBankList.forEach(payerBank -> {
			PayerBankDto payerBankDto = (PayerBankDto) MapperUtil.getObjectMapping(payerBank, new PayerBankDto());
			payerBankDtoList.add(payerBankDto);
		});

		return (new PagedRestResponse<>(payerBankDtoList, payerBankList));
	}

	/**
	 * @param payerBankList
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> savePayerBank(List<PayerBankDao> payerBankList, String operation,
			boolean isPublishToEGHS) {
		payerBankRepository.saveAll(payerBankList);
		List<SyncData> syncDataList = new ArrayList<>();
		PayerBankSyncDto payerBankSyncDto = new PayerBankSyncDto();
		syncDataList.add(DataSyncUtil.createSyncData(payerBankSyncDto.getSyncDtoList(payerBankList), 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Payer bank.
	 *
	 * @param payerBank
	 * @return PayerBankDto
	 */
	@Override
	public ListResponse<PayerBankDto> updatePayerBank(PayerBankUpdate payerBank) {

		List<PayerBankDao> payerBankDaoList = new ArrayList<>();
		List<PayerBankDto> payerBankDtoList = new ArrayList<>();
		Map<String, Boolean> payerBankMap = new HashMap<>();

		if (!payerBank.getUpdateBankName().isEmpty()) {

			payerBank.getUpdateBankName().forEach(
					payerBankUpdate -> payerBankMap.put(payerBankUpdate.getBankName(), payerBankUpdate.getIsActive()));

			List<PayerBankDao> payerBankDao = payerBankRepository.findAllByBankNameIn(payerBankMap.keySet());

			payerBankDao.forEach(payerBankData -> {
				payerBankData.setIsActive(payerBankMap.get(payerBankData.getBankName()));
				payerBankData.setSrcSyncId(payerBankData.getSrcSyncId() + 1);
				payerBankDaoList.add(payerBankData);
			});
			Map<String, SyncStagingDto> syncStagingDto = payerBankService.savePayerBank(payerBankDaoList,
					PaymentOperationCodes.PAYER_BANK_UPDATE, true);
			syncDataService.publishPaymentMessages(syncStagingDto);

			payerBankDaoList.forEach(payerBankResponse -> {
				PayerBankDto payerBankDto = (PayerBankDto) MapperUtil.getObjectMapping(payerBankResponse,
						new PayerBankDto());
				payerBankDtoList.add(payerBankDto);
			});
		}

		return new ListResponse<>(payerBankDtoList);
	}

}
