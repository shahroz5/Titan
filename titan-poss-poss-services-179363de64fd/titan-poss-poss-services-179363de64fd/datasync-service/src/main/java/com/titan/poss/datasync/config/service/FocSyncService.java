/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.titan.poss.config.dao.FocSchemeDetailsDao;
import com.titan.poss.config.dao.FocSchemeItemMappingDao;
import com.titan.poss.config.dao.FocSchemeLocationMappingDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.config.dao.FocSchemeProductMappingDao;
import com.titan.poss.config.dto.FocSchemeDetailsSyncDto;
import com.titan.poss.config.dto.FocSchemeItemMappingSyncDto;
import com.titan.poss.config.dto.FocSchemeLocationMappingSyncDto;
import com.titan.poss.config.dto.FocSchemeMasterSyncDto;
import com.titan.poss.config.dto.FocSchemeProductMappingSyncDto;
import com.titan.poss.config.repository.FocSchemeDetailsRepository;
import com.titan.poss.config.repository.FocSchemeItemMappingRepository;
import com.titan.poss.config.repository.FocSchemeLocationMappingRepository;
import com.titan.poss.config.repository.FocSchemeMasterRepository;
import com.titan.poss.config.repository.FocSchemeProductMappingRepository;
import com.titan.poss.core.domain.constant.NotificationConstants;
import com.titan.poss.core.dto.NotificationRequestDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class FocSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	FocSchemeMasterRepository focSchemeMasterRepository;

	@Autowired
	FocSchemeDetailsRepository focSchemeDetailsRepository;

	@Autowired
	FocSchemeLocationMappingRepository focLocationMappingRepository;

	@Autowired
	FocSchemeProductMappingRepository focProductMappingRepository;

	@Autowired
	FocSchemeItemMappingRepository focSchemeItemMappingRepository;

	@Autowired
	FocSyncService focService;

	@Value("${aws.sqs.profile}")
	private String locationCode;

	@Autowired
	EngineServiceClient engineServiceClient;

	private static final Logger LOGGER = LoggerFactory.getLogger(FocSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDataList) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.FOC_PUBLISH)
					|| operationCode.equals(ConfigServiceOperationCodes.MANUAL_FOC)) {
				if (syncData.getOrder() == 0) {
					getFocSchemeMasterAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 1) {
					getFocSchemeDetailsAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 2) {
					getFocSchemeLocationAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 3) {
					getFocProductAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 4) {
					getFocItemAndSave(syncData.getData(), syncData.getOrder());
				}
			}
		}
//		FocSchemeMasterDao srcFocDao = getSrcFocScheme(syncDataList.get(0).getData());
//		if (srcFocDao.getManualFoc().booleanValue()) {
//			FocSchemeMasterDao destFocDao = focSchemeMasterRepository.findOneById(srcFocDao.getId());
//			if (destFocDao != null) {
//				List<FocSchemeLocationMappingDao> locationMappingDaos = focLocationMappingRepository
//						.findByFocSchemeMasterDaoAndLocationCode(destFocDao, locationCode);
//				locationMappingDaos.forEach(location -> 
//				sendManualFocNotification(location.getStartDate(), location.getEndDate()));
//			}
//		}

		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}


	/**
	 * @param startDate
	 * @param endDate
	 */
	private void sendManualFocNotification(Date startDate, Date endDate) {
		NotificationRequestDto notificationRequestDto = new NotificationRequestDto();
		notificationRequestDto.setLocationCode(locationCode);
		Map<String, String> properties = new HashMap<>();
		properties.put("REQ_BTQ", locationCode);
		properties.put("From", startDate.toString());
		properties.put("To", endDate.toString());
		notificationRequestDto.setProperties(properties);
		notificationRequestDto.setNotificationCode(NotificationConstants.ACTIVATION_MANUAL_FOC);
	}

	/**
	 * @param data
	 * @param order
	 */
	public void getFocItemAndSave(Object data, int order) {
		FocSchemeItemMappingSyncDto focItemSyncDto = new FocSchemeItemMappingSyncDto();
		List<FocSchemeItemMappingDao> srcFocItemList = focItemSyncDto.getDaoList(MapperUtil
				.getObjectMapperInstance().convertValue(data, new TypeReference<List<FocSchemeItemMappingSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcFocItemList.forEach(src -> ids.add(src.getId()));
		List<FocSchemeItemMappingDao> destFocItemList = focSchemeItemMappingRepository.findAllById(ids);
		List<FocSchemeItemMappingDao> focItemList = new ArrayList<>();
		for (FocSchemeItemMappingDao srcFocItem : srcFocItemList) {
			boolean isNew = true;
			for (FocSchemeItemMappingDao destination : destFocItemList) {
				if (srcFocItem.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcFocItem.getSrcSyncId(),
							srcFocItem.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcFocItem.getSrcSyncId();
						srcFocItem.setSrcSyncId(srcFocItem.getDestSyncId());
						srcFocItem.setDestSyncId(tempSrcDataSyncId);
						focItemList.add(srcFocItem);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcFocItem.getSrcSyncId();
				srcFocItem.setSrcSyncId(srcFocItem.getDestSyncId());
				srcFocItem.setDestSyncId(tempSrcDataSyncId);
				focItemList.add(srcFocItem);
			}
		}
		focService.saveToDestinationDB(focItemList, order);

	}

	/**
	 * @param data
	 * @param order
	 */
	public void getFocProductAndSave(Object data, int order) {
		FocSchemeProductMappingSyncDto syncDto = new FocSchemeProductMappingSyncDto();
		List<FocSchemeProductMappingDao> srcFocProductList = syncDto
				.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
						new TypeReference<List<FocSchemeProductMappingSyncDto>>() {
						}));
		List<String> ids = new ArrayList<>();
		srcFocProductList.forEach(src -> ids.add(src.getId()));
		List<FocSchemeProductMappingDao> destFocProductList = focProductMappingRepository.findAllById(ids);
		List<FocSchemeProductMappingDao> focProductList = new ArrayList<>();
		for (FocSchemeProductMappingDao srcFocProduct : srcFocProductList) {
			boolean isNew = true;
			for (FocSchemeProductMappingDao destFoc : destFocProductList) {
				if (srcFocProduct.getId().equals(destFoc.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcFocProduct.getSrcSyncId(),
							srcFocProduct.getDestSyncId(), destFoc.getSrcSyncId(), destFoc.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcFocProduct.getSrcSyncId();
						srcFocProduct.setSrcSyncId(srcFocProduct.getDestSyncId());
						srcFocProduct.setDestSyncId(tempSrcDataSyncId);
						focProductList.add(srcFocProduct);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcFocProduct.getSrcSyncId();
				srcFocProduct.setSrcSyncId(srcFocProduct.getDestSyncId());
				srcFocProduct.setDestSyncId(tempSrcDataSyncId);
				focProductList.add(srcFocProduct);
			}
		}
		focService.saveToDestinationDB(focProductList, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	public void getFocSchemeLocationAndSave(Object data, int order) {
		FocSchemeLocationMappingSyncDto focLocSyncDto = new FocSchemeLocationMappingSyncDto();
		FocSchemeLocationMappingDao focSrcLocMappingDao = focLocSyncDto.getFocLocationDao(MapperUtil
				.getObjectMapperInstance().convertValue(data, new TypeReference<FocSchemeLocationMappingSyncDto>() {
				}));
		FocSchemeLocationMappingDao destFocLocDao = focLocationMappingRepository
				.findOneById(focSrcLocMappingDao.getId());
		if (destFocLocDao == null) {
			int tempSrcDataSyncId = focSrcLocMappingDao.getSrcSyncId();
			focSrcLocMappingDao.setSrcSyncId(focSrcLocMappingDao.getDestSyncId());
			focSrcLocMappingDao.setDestSyncId(tempSrcDataSyncId);
			focService.saveToDestinationDB(focSrcLocMappingDao, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(focSrcLocMappingDao.getSrcSyncId(),
					focSrcLocMappingDao.getDestSyncId(), destFocLocDao.getSrcSyncId(), destFocLocDao.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = focSrcLocMappingDao.getSrcSyncId();
				focSrcLocMappingDao.setSrcSyncId(focSrcLocMappingDao.getDestSyncId());
				focSrcLocMappingDao.setDestSyncId(tempSrcDataSyncId);
				focService.saveToDestinationDB(focSrcLocMappingDao, order);
			}
		}

	}

	/**
	 * @param data
	 * @param order
	 */
	public void getFocSchemeDetailsAndSave(Object data, int order) {
		FocSchemeDetailsSyncDto focSyncDto = new FocSchemeDetailsSyncDto();
		List<FocSchemeDetailsDao> srcFocDetailsList = focSyncDto.getDaoList(MapperUtil.getObjectMapperInstance()
				.convertValue(data, new TypeReference<List<FocSchemeDetailsSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcFocDetailsList.forEach(src -> ids.add(src.getId()));
		List<FocSchemeDetailsDao> destFocList = focSchemeDetailsRepository.findAllById(ids);
		List<FocSchemeDetailsDao> focDetailsList = new ArrayList<>();
		for (FocSchemeDetailsDao srcFocDetail : srcFocDetailsList) {
			boolean isNew = true;
			for (FocSchemeDetailsDao destination : destFocList) {
				if (srcFocDetail.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcFocDetail.getSrcSyncId(),
							srcFocDetail.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcFocDetail.getSrcSyncId();
						srcFocDetail.setSrcSyncId(srcFocDetail.getDestSyncId());
						srcFocDetail.setDestSyncId(tempSrcDataSyncId);
						focDetailsList.add(srcFocDetail);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcFocDetail.getSrcSyncId();
				srcFocDetail.setSrcSyncId(srcFocDetail.getDestSyncId());
				srcFocDetail.setDestSyncId(tempSrcDataSyncId);
				focDetailsList.add(srcFocDetail);
			}
		}
		focService.saveToDestinationDB(focDetailsList, order);

	}

	/**
	 * @param data
	 * @param order
	 */
	public void getFocSchemeMasterAndSave(Object data, int order) {
		FocSchemeMasterDao srcFocDao = getSrcFocScheme(data);
		FocSchemeMasterDao destFocDao = focSchemeMasterRepository.findOneById(srcFocDao.getId());
		if (destFocDao == null) {
			int tempSrcDataSyncId = srcFocDao.getSrcSyncId();
			srcFocDao.setSrcSyncId(srcFocDao.getDestSyncId());
			srcFocDao.setDestSyncId(tempSrcDataSyncId);
			focService.saveToDestinationDB(srcFocDao, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcFocDao.getSrcSyncId(), srcFocDao.getDestSyncId(),
					destFocDao.getSrcSyncId(), destFocDao.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = srcFocDao.getSrcSyncId();
				srcFocDao.setSrcSyncId(srcFocDao.getDestSyncId());
				srcFocDao.setDestSyncId(tempSrcDataSyncId);
				focService.saveToDestinationDB(srcFocDao, order);
			}
		}
	}

	/**
	 * @param data
	 * @return
	 */
	private FocSchemeMasterDao getSrcFocScheme(Object data) {
		FocSchemeMasterSyncDto focSyncDto = new FocSchemeMasterSyncDto();
		return focSyncDto.getFocSchemeMasterDao(
				MapperUtil.getObjectMapperInstance().convertValue(data, new TypeReference<FocSchemeMasterSyncDto>() {
				}));
	}

	/**
	 * @param srcDiscountDao
	 * @param order
	 */
	@SuppressWarnings("unchecked")
	@Transactional(value = "chainedTransaction")
	public void saveToDestinationDB(Object data, int order) {

		try {
			if (order == 0) {
				focSchemeMasterRepository.save((FocSchemeMasterDao) data);
			} else if (order == 1) {
				focSchemeDetailsRepository.saveAll((List<FocSchemeDetailsDao>) data);
			} else if (order == 2) {
				focLocationMappingRepository.save((FocSchemeLocationMappingDao) data);
			} else if (order == 3) {
				focProductMappingRepository.saveAll((List<FocSchemeProductMappingDao>) data);
			} else if (order == 4) {
				focSchemeItemMappingRepository.saveAll((List<FocSchemeItemMappingDao>) data);
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

}
