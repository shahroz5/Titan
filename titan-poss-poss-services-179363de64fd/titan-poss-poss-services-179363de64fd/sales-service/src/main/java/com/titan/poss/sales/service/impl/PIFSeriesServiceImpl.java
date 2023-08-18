/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.QPageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.PayeeBankLocationDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.PaymentServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.dao.PIFSeriesDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.PIFSeriesSyncDtoExt;
import com.titan.poss.sales.dto.request.PIFSeriesUpdateDto;
import com.titan.poss.sales.dto.request.PIFSeriesUpdateRequestDto;
import com.titan.poss.sales.dto.response.PIFSeriesDto;
import com.titan.poss.sales.repository.PIFSeriesRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.PIFSeriesService;
import com.titan.poss.sales.service.SalesSyncDataService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("pifSeriesServiceImpl")
@Slf4j
public class PIFSeriesServiceImpl implements PIFSeriesService {

	@Autowired
	PIFSeriesRepositoryExt pifSeriesRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	PIFSeriesServiceImpl pifSerieServiceImpl;
	
	@Autowired
	private EngineService engineService;
	
	@Autowired
	private PaymentServiceClient paymentServiceClient;
	
	@Autowired
	private EngineServiceClient engineServiceClient;

	@Value("${app.name}")
	private String appName;

	/**
	 * This Method will return the list of of PIF series
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<PIFSeriesDto>>
	 */
	@SuppressWarnings("unchecked")
	@Override

	public PagedRestResponse<List<PIFSeriesDto>> listPifSeries(Boolean isActive, Pageable pageable) {
		List<PIFSeriesDto> pifSeriesDtoList = new ArrayList<>();
		PIFSeriesDaoExt pifSeriesDao = new PIFSeriesDaoExt();
		pifSeriesDao.setLocationCode(CommonUtil.getLocationCode());
		pifSeriesDao.setPaymentCode(PaymentCodeEnum.CARD.name());
		pifSeriesDao.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PIFSeriesDaoExt> criteria = Example.of(pifSeriesDao, matcher);
		Page<PIFSeriesDaoExt> pifSeriesDaoPageList = pifSeriesRepository.findAll(criteria, pageable);
	
	   List<PayeeBankLocationDto> payeeBankDetails = getDataFromPayeeBankLocation();
	   for (PIFSeriesDaoExt pifSeriesDaoExt : pifSeriesDaoPageList) {
		for(PayeeBankLocationDto payeeBank :payeeBankDetails){
		        if(payeeBank.getBankName().equalsIgnoreCase(pifSeriesDaoExt.getBankName()) && payeeBank.getLocationCode().equalsIgnoreCase(pifSeriesDaoExt.getLocationCode()) &&
		        		payeeBank.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.CARD.name())) {
		        	if(payeeBank.getIsDefault()!=null) {
		        		pifSeriesDaoExt.setIsHomeBank(payeeBank.getIsDefault());
		        	}
		        }
		}
	   }
		for (PIFSeriesDaoExt pifSeriesDaoExt : pifSeriesDaoPageList) {
			if (pifSeriesDaoExt.getIsHomeBank() == null) {
				pifSeriesDaoExt.setIsHomeBank(false);
			}
		 pifSeriesDtoList.add((PIFSeriesDto) MapperUtil.getDtoMapping(pifSeriesDaoExt, PIFSeriesDto.class));
		}
//		  Page<PayeeBankLocationDto> locPAge=new PageImpl<>(payeeBankDetails, pageable, payeeBankDetails.size());
//	return new PagedRestResponse<>(payeeBankDetails , locPAge);
		return (new PagedRestResponse<>(pifSeriesDtoList, pifSeriesDaoPageList));
	}

	private List<PayeeBankLocationDto> getDataFromPayeeBankLocation() {
		List<PayeeBankLocationDto> payeeBankLocationDtos = new ArrayList<>();
		Object payeeBankDetailsobject = engineServiceClient.getPayeeBankLocationDetails();
		log.info("payeeBankDetailsobject {} {},", payeeBankDetailsobject, payeeBankDetailsobject.toString());
		List<PayeeBankLocationDto> payeeBankDetails =new ArrayList<>();
		JsonReader reader = new JsonReader(new StringReader(MapperUtil.getJsonString(payeeBankDetailsobject)));
		reader.setLenient(true);
		JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
		JsonArray payeebankjson = jsonObject.get("results").getAsJsonArray();
		for (int i = 0; i < payeebankjson.size(); i++) {
			JsonObject jsonObj = payeebankjson.get(i).getAsJsonObject();
			PayeeBankLocationDto data = new PayeeBankLocationDto();
			data.setId(jsonObj.get("id").getAsString());
			data.setGlCode(jsonObj.get("glCode").getAsString());
			data.setIsDefault(jsonObj.get("isDefault").getAsBoolean());
			data.setBankName(jsonObj.get("bankName").getAsString());
			data.setPaymentCode(jsonObj.get("paymentCode").getAsString());
			data.setLocationCode(jsonObj.get("locationCode").getAsString());
			payeeBankDetails.add(data);
			payeeBankLocationDtos.add(data);
		}
		return payeeBankLocationDtos;
	}

	/**
	 * This method will update the PIF series fromNo and toNo
	 * 
	 * @param pifSeriesRequestDto
	 * @return List<PIFSeriesDto>
	 */
	@Override
	public ListResponse<PIFSeriesDto> updatePifSeries(PIFSeriesUpdateRequestDto pifSeriesRequestDto) {

		List<String> ids = pifSeriesRequestDto.getPifSeriesUpdateReqDto().stream().map(PIFSeriesUpdateDto::getId)
				.collect(Collectors.toList());

		List<PIFSeriesDaoExt> pifSeriesDaoList = pifSeriesRepository.findAllById(ids);
		Map<String, PIFSeriesDaoExt> pifSeriesDaoMap = new HashMap<>();
		pifSeriesDaoList.forEach(pifSeriesDao -> pifSeriesDaoMap.put(pifSeriesDao.getId(), pifSeriesDao));
		pifSeriesDaoList = updatePifSeries(pifSeriesRequestDto, pifSeriesDaoMap);
		SyncStagingDto syncStagingDto = pifSerieServiceImpl.syncStagging(pifSeriesDaoList,
				SalesOperationCode.PIF_UPDATE);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
		return new ListResponse<>(getPifSeriesDtoResponse(pifSeriesDaoList));
	}

	@Transactional
	public SyncStagingDto syncStagging(List<PIFSeriesDaoExt> pifSeriesDaoList, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		if (!pifSeriesDaoList.isEmpty()) {
			List<PIFSeriesSyncDtoExt> syncDto = new ArrayList<>();
			pifSeriesDaoList.forEach(dao -> {
				dao.setSrcSyncId(dao.getSrcSyncId() + 1);
				syncDto.add(new PIFSeriesSyncDtoExt(dao));
			});
			pifSeriesRepository.saveAll(pifSeriesDaoList);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
		}
		SyncStagingDto salesStagingDto = new SyncStagingDto();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			MessageRequest salesMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());

			salesStagingDto.setMessageRequest(salesMsgRequest);
			String salesMsgRqst = MapperUtil.getJsonString(salesMsgRequest);
			SyncStaging salesSyncStaging = new SyncStaging();
			salesSyncStaging.setMessage(salesMsgRqst);
			salesSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			salesSyncStaging = saleSyncStagingRepository.save(salesSyncStaging);
			salesStagingDto.setId(salesSyncStaging.getId());
		}
		return salesStagingDto;
	}

	/**
	 * @param pifSeriesRequestDto
	 * @param pifSeriesDaoMap
	 * @return
	 */
	private List<PIFSeriesDaoExt> updatePifSeries(PIFSeriesUpdateRequestDto pifSeriesRequestDto,
			Map<String, PIFSeriesDaoExt> pifSeriesDaoMap) {
		List<PIFSeriesDaoExt> pifSeriesDaoList = new ArrayList<>();
		pifSeriesRequestDto.getPifSeriesUpdateReqDto().forEach(pifSeriesUpdateDto -> {
			PIFSeriesDaoExt pifSeriesDao = pifSeriesDaoMap.get(pifSeriesUpdateDto.getId());
			if ((pifSeriesDao.getPaymentCode().equals(PaymentCodeEnum.CASH.name())
					|| pifSeriesDao.getPaymentCode().equals(PaymentCodeEnum.CARD.name()))
					&& pifSeriesDao.getToNo() > 9999) {
				throw new ServiceException("toNo value can't be more than 4 digits for CASH/CARD", "ERR-SALE-287");
			}
			if ((pifSeriesDao.getPaymentCode().equals(PaymentCodeEnum.CHEQUE.name())
					|| pifSeriesDao.getPaymentCode().equals(PaymentCodeEnum.DD.name()))
					&& pifSeriesDao.getToNo() > 999999) {
				throw new ServiceException("toNo value can't be more than 6 digits for CHEQUE/DD", "ERR-SALE-288");
			}
			if (pifSeriesUpdateDto.getFromNo() > pifSeriesUpdateDto.getToNo()) {
				throw new ServiceException("fromNo value can't be greater that toNo value", "ERR-SALE-276");
			}
			if (pifSeriesUpdateDto.getFromNo() != null)
				pifSeriesDao.setFromNo(pifSeriesUpdateDto.getFromNo());
			if (pifSeriesUpdateDto.getToNo() != null)
				pifSeriesDao.setToNo(pifSeriesUpdateDto.getToNo());
			if (!(pifSeriesDao.getCurrentSeqNo() >= pifSeriesDao.getFromNo()
					&& pifSeriesDao.getCurrentSeqNo() <= pifSeriesDao.getToNo())) {
				pifSeriesDao.setCurrentSeqNo(0);
			}
			pifSeriesDaoList.add(pifSeriesDao);
		});
		return pifSeriesDaoList;
	}

	/**
	 * @param pifSeriesDaoList
	 * @return
	 */
	private List<PIFSeriesDto> getPifSeriesDtoResponse(List<PIFSeriesDaoExt> pifSeriesDaoList) {

		List<PIFSeriesDto> pifSeriesDtoList = new ArrayList<>();

		pifSeriesDaoList.forEach(pifSeriesDao -> pifSeriesDtoList
				.add((PIFSeriesDto) MapperUtil.getDtoMapping(pifSeriesDao, PIFSeriesDto.class)));
		return pifSeriesDtoList;
	}
}
