package com.titan.poss.payment.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.PaymentSyncDataService;

import feign.Response;

@Service
public class PaymentSyncDataServiceImpl implements PaymentSyncDataService{
	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";
	@Override
	public void publishPaymentMessagesToQueue(SyncStagingDto paymentData) {
		if (isEnabled) {

			Map<String, Boolean> statusMap = new HashMap<>();
			statusMap.put(ISOFFLINE, false);
			statusMap.put(ISPUBLISHTOEGHS, false);
			try {
				String destType = paymentData.getMessageRequest().getDestinationType();
				if (DestinationType.SELECTIVE.name().equals(destType)) {
					String dest = paymentData.getMessageRequest().getDestinations().get(0);
					getStatus(statusMap, dest);
				}
				if (statusMap.get(ISOFFLINE).booleanValue() || DestinationType.ALL.name().equals(destType)
						|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
					Response res = dataSyncServiceClient.publish(paymentData.getMessageRequest());
					if (res.status() == 200) {
						paymentSyncStagingRepository.deleteById(paymentData.getId());
						LOGGER.info("Published : {} ", paymentData.getMessageRequest());
					}
				} else {
					paymentSyncStagingRepository.deleteById(paymentData.getId());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
		
	}

	/**
	 * @param statusMap
	 * @param dest
	 */
	private void getStatus(Map<String, Boolean> statusMap, String dest) {
		if (!dest.equals("EGHS")) {
			LocationCacheDto paymentLocDto = engineServiceClient.getStoreLocation(dest);
			if (paymentLocDto != null)
				statusMap.replace(ISOFFLINE, paymentLocDto.getIsOffline());
		} else {
			statusMap.replace(ISPUBLISHTOEGHS, true);
		}

	}

	@Override
	public void publishPaymentMessages(Map<String, SyncStagingDto> data) {
		if (data.containsKey("EGHS")) {
			publishPaymentMessagesToQueue(data.get("EGHS"));
		}
		if (data.containsKey("POSS")) {
			publishPaymentMessagesToQueue(data.get("POSS"));
		}
	}

	@Override
	public Map<String, SyncStagingDto> getPaymentSyncStagingMap(List<SyncData> paymentSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType) {
		Map<String, SyncStagingDto> locStagingMap = new HashMap<>();
		if (isPublishToEGHS) {
			locStagingMap.put("EGHS", getEGHSSyncStagingDto(paymentSyncDataList, operation, messageType));
		}
		SyncStagingDto locStagingDto = new SyncStagingDto();
		MessageRequest msgRqst = DataSyncUtil.createMessageRequest(paymentSyncDataList, operation, destinations,
				messageType, destinationType);
		String requestBody = MapperUtil.getJsonString(msgRqst);
		locStagingDto.setMessageRequest(msgRqst);
		SyncStaging locSyncStaging = new SyncStaging();
		locSyncStaging.setMessage(requestBody);
		locSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		locSyncStaging = paymentSyncStagingRepository.save(locSyncStaging);
		locStagingDto.setId(locSyncStaging.getId());
		locStagingMap.put("POSS", locStagingDto);
		return locStagingMap;
	}

	@Override
	public SyncStagingDto getEGHSSyncStagingDto(List<SyncData> paymentSyncDataList, String operation,
			String messageType) {
		List<String> dest = new ArrayList<>();
		SyncStagingDto paymentEghsStagingDto = new SyncStagingDto();
		dest.add("EGHS");
		MessageRequest eghsMsgRqst = DataSyncUtil.createMessageRequest(paymentSyncDataList, operation, dest,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		String eghsRequestBody = MapperUtil.getJsonString(eghsMsgRqst);
		paymentEghsStagingDto.setMessageRequest(eghsMsgRqst);
		SyncStaging paymentEghsStaging = new SyncStaging();
		paymentEghsStaging.setMessage(eghsRequestBody);
		paymentEghsStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		paymentEghsStaging = paymentSyncStagingRepository.save(paymentEghsStaging);
		paymentEghsStagingDto.setId(paymentEghsStaging.getId());
		return paymentEghsStagingDto;
	}

}
