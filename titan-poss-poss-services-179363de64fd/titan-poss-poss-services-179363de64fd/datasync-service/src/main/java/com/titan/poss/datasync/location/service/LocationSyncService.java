/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dto.LocationSyncDto;
import com.titan.poss.location.repository.LocationRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class LocationSyncService implements SyncOperation {

	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Value("${locationCache}")
	private String locationCache;

	@Value("${aws.sqs.profile}")
	String possLocation;

	@Autowired
	private EpossCallService epossCallService;

	private static final Logger LOGGER = LoggerFactory.getLogger(LocationSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			LocationSyncDto locationSyncDto = new LocationSyncDto();
			LocationDao sourceLocation = locationSyncDto
					.getLocationDao(mapper.convertValue(data.getData(), new TypeReference<LocationSyncDto>() {
					}));

			LocationDao destinationLocation = locationRepository
					.findOneByLocationCode(sourceLocation.getLocationCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.LOCATION_ADD)
					|| operationCode.equals(LocationOperationCodes.LOCATION_UPDATE)) {

				if (destinationLocation == null) {
					saveToDestinationDB(sourceLocation, messageId, messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceLocation, destinationLocation);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {
						saveToDestinationDB(sourceLocation, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}

		});
	}

	@Transactional
	public void saveToDestinationDB(LocationDao sourceLocation, String messageId, String dest) {
		// first clearing the cache in engine service
		String authToken = epossCallService.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
		engineServiceClient.clearCacheWithToken("Bearer " + authToken, locationCache, sourceLocation.getLocationCode());

		Boolean home = false;

		int tempSrcDataSyncId = sourceLocation.getSrcSyncId();
		sourceLocation.setSrcSyncId(sourceLocation.getDestSyncId());
		sourceLocation.setDestSyncId(tempSrcDataSyncId);

		if (possLocation.equals(sourceLocation.getLocationCode())) {
			home = true;
		}
		sourceLocation.setIsHome(home);
		try {
			locationRepository.saveAndFlush(sourceLocation);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(LocationDao src, LocationDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}

}
