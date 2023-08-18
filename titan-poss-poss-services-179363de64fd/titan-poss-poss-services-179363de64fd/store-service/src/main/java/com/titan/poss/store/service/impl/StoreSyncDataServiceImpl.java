package com.titan.poss.store.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.store.repository.StoreSyncStagingRepository;
import com.titan.poss.store.service.StoreSyncDataService;

import feign.Response;
@Service
public class StoreSyncDataServiceImpl implements StoreSyncDataService{
	@Autowired
	private StoreSyncStagingRepository storeSyncStagingRepository;
	
	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Value("${datasync.enable}")
	private boolean isEnabled;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(StoreSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	public void publishPaymentMessagesToQueue(SyncStagingDto data) {
		if (isEnabled) {
			try {
				data.getMessageRequest().setSource(CommonUtil.getLocationCode());
				Response response = dataSyncServiceClient.publish(data.getMessageRequest());
				if (response.status() == 200) {
					storeSyncStagingRepository.deleteById(data.getId());
					LOGGER.info("Published : {} ", data.getMessageRequest());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
		
	}

}
