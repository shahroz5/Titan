package com.titan.poss.datasync.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.repository.DataSyncRepository;

import feign.Response;
@Service
public class DataSyncDataServiceImpl implements DataSyncDataService{
	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;
	
	@Autowired
	DataSyncRepository dataSyncStagingRepository;

	@Value("${datasync.enable}")
	private boolean isEnabled;
	
	@Value("${app.name}")
	private String appName;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(DataSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	public void publishDataSyncDataToQueue(String token,SyncStagingDto data) {
		if (isEnabled) {
			try {
				if(AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) 
					data.getMessageRequest().setSource(CommonUtil.getLocationCode());
				else
					data.getMessageRequest().setSource(AppTypeEnum.EPOSS.name());
				Response response = dataSyncServiceClient.publishWithToken(token, data.getMessageRequest());
				if (response.status() == 200) {
					dataSyncStagingRepository.deleteById(data.getId());
					LOGGER.info("Published : {} ", data.getMessageRequest());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
		
	}

}
