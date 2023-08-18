/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.LOV_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.constants.LovTypeEnum;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.PaymentLovDaoExt;
import com.titan.poss.payment.dto.KeyValueDto;
import com.titan.poss.payment.dto.LovCreateDto;
import com.titan.poss.payment.dto.PaymentLovSyncDtoExt;
import com.titan.poss.payment.dto.request.LovUpdateDto;
import com.titan.poss.payment.dto.response.LovDto;
import com.titan.poss.payment.dto.response.LovTypesDto;
import com.titan.poss.payment.repository.PaymentLovRepositoryExt;
import com.titan.poss.payment.service.LovService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(LOV_SERVICE_IMPL)
public class LovServiceImpl implements LovService {

	@Autowired
	private PaymentLovRepositoryExt lovRepository;

	@Autowired
	private LovServiceImpl lovService;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@Override
	public LovTypesDto getLovTypes() {
		List<String> lovTypes = new ArrayList<>();
		EnumSet.allOf(LovTypeEnum.class).forEach(lovTypeEnum -> lovTypes.add(lovTypeEnum.toString()));
		LovTypesDto lovTypesDto = new LovTypesDto();
		lovTypesDto.setLovTypes(lovTypes);
		return lovTypesDto;
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@Override
	public LovDto getLov(String lovType, String lovCode) {
		List<PaymentLovDaoExt> paymentLovList = lovRepository.findByLovTypeAndCode(lovType, lovCode);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!paymentLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = new ArrayList<>();
			paymentLovList.forEach(paymentLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(paymentLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoList);
		} else {
			lovDto.setResults(new ArrayList<>());
		}
		return lovDto;
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@Override
	public LovCreateDto createLov(LovCreateDto lovCreateDto) {
		PaymentLovDaoExt paymentLovCriteria = new PaymentLovDaoExt();
		paymentLovCriteria.setLovType(lovCreateDto.getLovType());
		paymentLovCriteria.setCode(lovCreateDto.getCode());

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PaymentLovDaoExt> criteria = Example.of(paymentLovCriteria, matcher);

		Optional<PaymentLovDaoExt> paymentLovOptional = lovRepository.findOne(criteria);

		if (!paymentLovOptional.isEmpty())
			throw new ServiceException(PaymentConstants.LOV_TYPE_AND_CODE_IS_ALREADY_AVAILABLE,
					PaymentConstants.ERR_LOC_016);

		PaymentLovDaoExt paymentLovDao = (PaymentLovDaoExt) MapperUtil.getObjectMapping(lovCreateDto,
				new PaymentLovDaoExt());
		paymentLovDao.setLovType(lovCreateDto.getLovType());
		paymentLovDao.setIsActive(true);
		paymentLovDao.setSrcSyncId(0);
		paymentLovDao.setDestSyncId(0);
		List<PaymentLovDaoExt> paymentLovList = new ArrayList<>();
		paymentLovList.add(paymentLovDao);
		Map<String, SyncStagingDto> syncStagingDto = lovService.saveLov(paymentLovList,
				PaymentOperationCodes.PAYMENT_LOV_ADD, true);
		syncDataService.publishPaymentMessages(syncStagingDto);

		return lovCreateDto;
	}

	/**
	 * @param paymentLovList
	 * @param operation
	 * @return Map<String, SyncStagingDto>
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveLov(List<PaymentLovDaoExt> paymentLovList, String operation,
			boolean isPublishToEGHS) {
		paymentLovList = lovRepository.saveAll(paymentLovList);
		List<SyncData> syncDataList = new ArrayList<>();
		PaymentLovSyncDtoExt paymentLovSyncDto = new PaymentLovSyncDtoExt();
		syncDataList.add(DataSyncUtil.createSyncData(paymentLovSyncDto.getLovSyncDtoList(paymentLovList), 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@Override
	public LovDto updateLov(String lovType, LovUpdateDto lovUpdateDto) {

		List<PaymentLovDaoExt> paymentLovList = lovRepository.findByLovType(lovType);
		List<KeyValueDto> keyValueDtoList = lovUpdateDto.getValues();
		int sizeDto = keyValueDtoList.size();
		int size = paymentLovList.size();

		for (int i = 0; i < sizeDto; i++) {
			Integer index = null;
			for (int j = 0; j < size; j++) {
				if (paymentLovList.get(j).getCode().equalsIgnoreCase(keyValueDtoList.get(i).getCode())) {
					index = j;
					break;
				}
			}
			if (index != null) {

				PaymentLovDaoExt paymentLovDao = paymentLovList.get(index);

				paymentLovDao.setValue(keyValueDtoList.get(i).getValue());
				paymentLovDao.setIsActive(keyValueDtoList.get(i).getIsActive());
				paymentLovDao.setSrcSyncId(paymentLovDao.getSrcSyncId() + 1);
				paymentLovList.set(index, paymentLovDao);

			} else {

				PaymentLovDaoExt paymentLovDao = new PaymentLovDaoExt();
				paymentLovDao.setLovType(lovType);
				paymentLovDao.setCode(keyValueDtoList.get(i).getCode());
				paymentLovDao.setValue(keyValueDtoList.get(i).getValue());
				paymentLovDao.setIsActive(keyValueDtoList.get(i).getIsActive());
				paymentLovDao.setSrcSyncId(0);
				paymentLovDao.setDestSyncId(0);
				paymentLovList.add(paymentLovDao);

			}
		}

		Map<String, SyncStagingDto> syncStagingDto = lovService.saveLov(paymentLovList, PaymentOperationCodes.PAYMENT_LOV_UPDATE, true);
		syncDataService.publishPaymentMessages(syncStagingDto);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!paymentLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoResList = new ArrayList<>();
			paymentLovList.forEach(paymentLov -> keyValueDtoResList
					.add((KeyValueDto) MapperUtil.getObjectMapping(paymentLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoResList);
		} else {
			lovDto.setResults(new ArrayList<>());
		}

		return lovDto;
	}

}
