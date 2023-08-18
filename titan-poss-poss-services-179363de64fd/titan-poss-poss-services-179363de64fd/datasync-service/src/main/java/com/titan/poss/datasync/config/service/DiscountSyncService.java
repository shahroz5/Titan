/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.titan.poss.config.dao.ClubbingDiscountsDao;
import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.config.dao.DiscountLocationMappingDao;
import com.titan.poss.config.dao.DiscountProductCategoryMappingDao;
import com.titan.poss.config.dao.DiscountProductGroupMappingDao;
import com.titan.poss.config.dao.LinkingDiscountsDao;
import com.titan.poss.config.dto.ClubbingDiscountsSyncDto;
import com.titan.poss.config.dto.DiscountDetailsSyncDto;
import com.titan.poss.config.dto.DiscountExcludeMappingSyncDto;
import com.titan.poss.config.dto.DiscountItemMappingSyncDto;
import com.titan.poss.config.dto.DiscountLocationMappingSyncDto;
import com.titan.poss.config.dto.DiscountProductCategorySyncDto;
import com.titan.poss.config.dto.DiscountProductGroupMappingSyncDto;
import com.titan.poss.config.dto.DiscountSyncDto;
import com.titan.poss.config.dto.LinkingDiscountsSyncDto;
import com.titan.poss.config.repository.ClubbingDiscountsRepository;
import com.titan.poss.config.repository.DiscountDetailsRepository;
import com.titan.poss.config.repository.DiscountExcludeMappingRepository;
import com.titan.poss.config.repository.DiscountItemMappingRepository;
import com.titan.poss.config.repository.DiscountLocationMappingRepository;
import com.titan.poss.config.repository.DiscountProductCategoryMappingRepository;
import com.titan.poss.config.repository.DiscountProductGroupMappingRepository;
import com.titan.poss.config.repository.DiscountRepository;
import com.titan.poss.config.repository.LinkingDiscountsRepository;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
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
public class DiscountSyncService implements SyncOperation {

	@Autowired
	DiscountRepository discountRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	DiscountLocationMappingRepository discountLocationMappingRepository;

	@Autowired
	DiscountProductCategoryMappingRepository discountProductCategoryMappingRepository;

	@Autowired
	DiscountProductGroupMappingRepository discountProductGroupMappingRepository;

	@Autowired
	DiscountItemMappingRepository discountItemMappingRepository;

	@Autowired
	DiscountExcludeMappingRepository discountExcludeMappingRepository;

	@Autowired
	DiscountDetailsRepository discountDetailsRepository;

	@Autowired
	ClubbingDiscountsRepository clubbingDiscountsRepository;

	@Autowired
	LinkingDiscountsRepository linkingDiscountsRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(DiscountSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDataList) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.DISCOUNT_PUBLISH)
					|| operationCode.equals(ProductOperationCodes.ITEM_GROUP_LEVEL_DISCOUNT_ADD)) {
				if (syncData.getOrder() == 0) {
					getDiscountMasterAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 1) {
					getDiscountLocationAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 5) {
					getDiscountPrdGrpAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 3) {
					getDiscountPrdCategoryAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 4) {
					getDiscountItemAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 2) {
					getDiscountDetailsAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 6) {
					getDiscountExcludeAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 7) {
					getDiscountLinkAndSave(syncData.getData(), syncData.getOrder());
				}
			} else if (operationCode.equals(ConfigServiceOperationCodes.DISCOUNT_CLUB_MAPPING)) {
				getDiscountClubAndSave(syncData.getData(), syncData.getOrder());
			}
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,
				messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountClubAndSave(Object data, int order) {
		ClubbingDiscountsSyncDto syncDto = new ClubbingDiscountsSyncDto();
		List<ClubbingDiscountsDao> srcClubbingList = syncDto.getDaoList(MapperUtil.getObjectMapperInstance()
				.convertValue(data, new TypeReference<List<ClubbingDiscountsSyncDto>>() {
				}));

		for (ClubbingDiscountsDao srcDiscountClub : srcClubbingList) {
			getDestinationClubbingDiscount(srcDiscountClub,order);

		}
	}

	/**
	 * @param delClubbingList
	 * @param newClubbingList
	 * @param order
	 */
	private void saveClubbingDiscounts(List<ClubbingDiscountsDao> delClubbingList,
			List<ClubbingDiscountsDao> newClubbingList, int order) {
		try {

			if (order == 8) {
				clubbingDiscountsRepository.deleteAll(delClubbingList);
			} else if (order == 9) {
				if (!delClubbingList.isEmpty()) {
					clubbingDiscountsRepository.deleteAll(delClubbingList);
					clubbingDiscountsRepository.flush();
				}
				clubbingDiscountsRepository.saveAll(newClubbingList);
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

	/**
	 * @param order 
	 * @param srcGepProducts
	 * @return 
	 * @return 
	 * @return
	 */
	private void getDestinationClubbingDiscount(ClubbingDiscountsDao srcDiscountClub, int order) {
		String discount1 = null;
		String discount2 = null;
		String discount3 = null;
		List<ClubbingDiscountsDao> delClubbingList = new ArrayList<>();
		List<ClubbingDiscountsDao> newClubbingList = new ArrayList<>();
		if (srcDiscountClub.getDiscount1() != null) {
			discount1 = srcDiscountClub.getDiscount1().getId();
		}
		if (srcDiscountClub.getDiscount2() != null) {
			discount2 = srcDiscountClub.getDiscount2().getId();
		}
		if (srcDiscountClub.getDiscount3() != null) {
			discount3 = srcDiscountClub.getDiscount3().getId();
		}
		
		List<ClubbingDiscountsDao> clubDiscounts = clubbingDiscountsRepository.getByDiscount(discount1, discount2, discount3);
		clubDiscounts.forEach(club -> {
			int count = 0;
			String d1 = null;
			String d2 = null;
			String d3 = null;
			if (srcDiscountClub.getDiscount1() != null) {
				d1 = srcDiscountClub.getDiscount1().getId();
			}
			if (srcDiscountClub.getDiscount2() != null) {
				d2 = srcDiscountClub.getDiscount2().getId();
			}
			if (srcDiscountClub.getDiscount3() != null) {
				d3 = srcDiscountClub.getDiscount3().getId();
			}
			String c1 = null;
			String c2 = null;
			String c3 = null;
			if (club.getDiscount1() != null) {
				c1 = club.getDiscount1().getId();
			}
			if (club.getDiscount2() != null) {
				c2 = club.getDiscount2().getId();
			}
			if (club.getDiscount3() != null) {
				c3 = club.getDiscount3().getId();
			}
			if((c1 == null && d1 == null) || (c1 != null && d1 != null && c1.equals(d1)))
				count ++;
			if((c2 == null && d2 == null) || (c2 != null && d2 != null && c2.equals(d2)))
				count ++;
			if((c3 == null && d3 == null) || (c3 != null && d3 != null && c3.equals(d3)))
				count ++;
			if(count == 3) {
				if (srcDiscountClub.getSyncTime() >= club.getSyncTime()) {
					if (order == 8) {
						delClubbingList.add(club);
					} else if (order == 9) {
						delClubbingList.add(club);
						newClubbingList.add(srcDiscountClub);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			}
		});
		if(order == 9 && newClubbingList.isEmpty())
			newClubbingList.add(srcDiscountClub);
		saveClubbingDiscounts(delClubbingList, newClubbingList, order);
		
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountLinkAndSave(Object data, int order) {
		LinkingDiscountsSyncDto syncDto = new LinkingDiscountsSyncDto();
		List<LinkingDiscountsDao> srcLinkingList = syncDto.getDaoList(MapperUtil.getObjectMapperInstance()
				.convertValue(data, new TypeReference<List<LinkingDiscountsSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcLinkingList.forEach(src -> ids.add(src.getId()));
		List<LinkingDiscountsDao> destList = linkingDiscountsRepository.findAllById(ids);
		List<LinkingDiscountsDao> disLinkList = new ArrayList<>();
		for (LinkingDiscountsDao srcDisLink : srcLinkingList) {
			boolean isNew = true;
			for (LinkingDiscountsDao destination : destList) {
				if (srcDisLink.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDisLink.getSrcSyncId(),
							srcDisLink.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcDisLink.getSrcSyncId();
						srcDisLink.setSrcSyncId(srcDisLink.getDestSyncId());
						srcDisLink.setDestSyncId(tempSrcDataSyncId);
						disLinkList.add(srcDisLink);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcDisLink.getSrcSyncId();
				srcDisLink.setSrcSyncId(srcDisLink.getDestSyncId());
				srcDisLink.setDestSyncId(tempSrcDataSyncId);
				disLinkList.add(srcDisLink);
			}

		}
		saveToDestinationDB(disLinkList, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountExcludeAndSave(Object data, int order) {
		DiscountExcludeMappingSyncDto syncDto = new DiscountExcludeMappingSyncDto();
		List<DiscountExcludeMappingDao> srcExludeList = syncDto.getDaoList(MapperUtil.getObjectMapperInstance()
				.convertValue(data, new TypeReference<List<DiscountExcludeMappingSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcExludeList.forEach(src -> ids.add(src.getId()));
		List<DiscountExcludeMappingDao> destList = discountExcludeMappingRepository.findAllById(ids);
		List<DiscountExcludeMappingDao> disExcludeList = new ArrayList<>();
		for (DiscountExcludeMappingDao srcDisExclude : srcExludeList) {
			boolean isNew = true;
			for (DiscountExcludeMappingDao destination : destList) {
				if (srcDisExclude.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDisExclude.getSrcSyncId(),
							srcDisExclude.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcDisExclude.getSrcSyncId();
						srcDisExclude.setSrcSyncId(srcDisExclude.getDestSyncId());
						srcDisExclude.setDestSyncId(tempSrcDataSyncId);
						disExcludeList.add(srcDisExclude);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcDisExclude.getSrcSyncId();
				srcDisExclude.setSrcSyncId(srcDisExclude.getDestSyncId());
				srcDisExclude.setDestSyncId(tempSrcDataSyncId);
				disExcludeList.add(srcDisExclude);
			}
		}
		saveToDestinationDB(disExcludeList, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountDetailsAndSave(Object data, int order) {
		DiscountDetailsSyncDto syncDto = new DiscountDetailsSyncDto();
		List<DiscountDetailsDao> srcDiscountDetailsDaos = syncDto.getDaoList(MapperUtil.getObjectMapperInstance()
				.convertValue(data, new TypeReference<List<DiscountDetailsSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcDiscountDetailsDaos.forEach(src -> ids.add(src.getId()));
		List<DiscountDetailsDao> destList = discountDetailsRepository.findAllById(ids);
		List<DiscountDetailsDao> disDetailsList = new ArrayList<>();
		List<DiscountDetailsDao> newDetailsList = new ArrayList<>();
		for (DiscountDetailsDao srcDiscountDetail : srcDiscountDetailsDaos) {
			boolean isNew = true;
			for (DiscountDetailsDao destination : destList) {
				if (srcDiscountDetail.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDiscountDetail.getSrcSyncId(),
							srcDiscountDetail.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcDiscountDetail.getSrcSyncId();
						srcDiscountDetail.setSrcSyncId(srcDiscountDetail.getDestSyncId());
						srcDiscountDetail.setDestSyncId(tempSrcDataSyncId);
						disDetailsList.add(srcDiscountDetail);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcDiscountDetail.getSrcSyncId();
				srcDiscountDetail.setSrcSyncId(srcDiscountDetail.getDestSyncId());
				srcDiscountDetail.setDestSyncId(tempSrcDataSyncId);
				newDetailsList.add(srcDiscountDetail);
			}
		}
		saveToDestinationDB(disDetailsList, order);
		if (!newDetailsList.isEmpty())
			discountDetailsRepository.saveAll(newDetailsList);

	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountItemAndSave(Object data, int order) {

		DiscountItemMappingSyncDto syncDto = new DiscountItemMappingSyncDto();
		List<DiscountItemMappingDao> srcDiscountItemList = syncDto.getDaoList(MapperUtil.getObjectMapperInstance()
				.convertValue(data, new TypeReference<List<DiscountItemMappingSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcDiscountItemList.forEach(src -> ids.add(src.getId()));
		List<DiscountItemMappingDao> destList = discountItemMappingRepository.findAllById(ids);
		List<DiscountItemMappingDao> disItemList = new ArrayList<>();
		for (DiscountItemMappingDao srcDiscountItem : srcDiscountItemList) {
			boolean isNew = true;
			for (DiscountItemMappingDao destination : destList) {
				if (srcDiscountItem.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDiscountItem.getSrcSyncId(),
							srcDiscountItem.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcDiscountItem.getSrcSyncId();
						srcDiscountItem.setSrcSyncId(srcDiscountItem.getDestSyncId());
						srcDiscountItem.setDestSyncId(tempSrcDataSyncId);
						disItemList.add(srcDiscountItem);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcDiscountItem.getSrcSyncId();
				srcDiscountItem.setSrcSyncId(srcDiscountItem.getDestSyncId());
				srcDiscountItem.setDestSyncId(tempSrcDataSyncId);
				disItemList.add(srcDiscountItem);
			}
		}
		saveToDestinationDB(disItemList, order);

	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountPrdCategoryAndSave(Object data, int order) {
		DiscountProductCategorySyncDto syncDto = new DiscountProductCategorySyncDto();
		List<DiscountProductCategoryMappingDao> srcCategoryList = syncDto
				.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
						new TypeReference<List<DiscountProductCategorySyncDto>>() {
						}));
		List<String> ids = new ArrayList<>();
		srcCategoryList.forEach(src -> ids.add(src.getId()));
		List<DiscountProductCategoryMappingDao> destList = discountProductCategoryMappingRepository.findAllById(ids);
		List<DiscountProductCategoryMappingDao> dpcList = new ArrayList<>();
		for (DiscountProductCategoryMappingDao srcPrdCategory : srcCategoryList) {
			boolean isNew = true;
			for (DiscountProductCategoryMappingDao destination : destList) {
				if (srcPrdCategory.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPrdCategory.getSrcSyncId(),
							srcPrdCategory.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcPrdCategory.getSrcSyncId();
						srcPrdCategory.setSrcSyncId(srcPrdCategory.getDestSyncId());
						srcPrdCategory.setDestSyncId(tempSrcDataSyncId);
						dpcList.add(srcPrdCategory);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcPrdCategory.getSrcSyncId();
				srcPrdCategory.setSrcSyncId(srcPrdCategory.getDestSyncId());
				srcPrdCategory.setDestSyncId(tempSrcDataSyncId);
				dpcList.add(srcPrdCategory);
			}
		}
		saveToDestinationDB(dpcList, order);

	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountPrdGrpAndSave(Object data, int order) {
		DiscountProductGroupMappingSyncDto syncDto = new DiscountProductGroupMappingSyncDto();
		List<DiscountProductGroupMappingDao> srcDiscountPrdGrpList = syncDto
				.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
						new TypeReference<List<DiscountProductGroupMappingSyncDto>>() {
						}));
		List<String> ids = new ArrayList<>();
		srcDiscountPrdGrpList.forEach(src -> ids.add(src.getId()));
		List<DiscountProductGroupMappingDao> destList = discountProductGroupMappingRepository.findAllById(ids);
		List<DiscountProductGroupMappingDao> dpgList = new ArrayList<>();
		for (DiscountProductGroupMappingDao srcPrdGrp : srcDiscountPrdGrpList) {
			boolean isNew = true;
			for (DiscountProductGroupMappingDao destination : destList) {
				if (srcPrdGrp.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPrdGrp.getSrcSyncId(),
							srcPrdGrp.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						int tempSrcDataSyncId = srcPrdGrp.getSrcSyncId();
						srcPrdGrp.setSrcSyncId(srcPrdGrp.getDestSyncId());
						srcPrdGrp.setDestSyncId(tempSrcDataSyncId);
						dpgList.add(srcPrdGrp);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcPrdGrp.getSrcSyncId();
				srcPrdGrp.setSrcSyncId(srcPrdGrp.getDestSyncId());
				srcPrdGrp.setDestSyncId(tempSrcDataSyncId);
				dpgList.add(srcPrdGrp);
			}
		}
		saveToDestinationDB(dpgList, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountLocationAndSave(Object data, int order) {
		DiscountLocationMappingSyncDto disLocSyncDto = new DiscountLocationMappingSyncDto();
		DiscountLocationMappingDao srcLocationMappingDao = disLocSyncDto.getDiscountLocationMappingDao(MapperUtil
				.getObjectMapperInstance().convertValue(data, new TypeReference<DiscountLocationMappingSyncDto>() {
				}));
		DiscountLocationMappingDao destLocationMappingDao = discountLocationMappingRepository
				.findOneById(srcLocationMappingDao.getId());
		if (destLocationMappingDao == null) {
			int tempSrcDataSyncId = srcLocationMappingDao.getSrcSyncId();
			srcLocationMappingDao.setSrcSyncId(srcLocationMappingDao.getDestSyncId());
			srcLocationMappingDao.setDestSyncId(tempSrcDataSyncId);
			saveToDestinationDB(srcLocationMappingDao, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcLocationMappingDao.getSrcSyncId(),
					srcLocationMappingDao.getDestSyncId(), destLocationMappingDao.getSrcSyncId(),
					destLocationMappingDao.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = srcLocationMappingDao.getSrcSyncId();
				srcLocationMappingDao.setSrcSyncId(srcLocationMappingDao.getDestSyncId());
				srcLocationMappingDao.setDestSyncId(tempSrcDataSyncId);
				saveToDestinationDB(srcLocationMappingDao, order);
			}
		}
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getDiscountMasterAndSave(Object data, int order) {
		DiscountSyncDto discountSyncDto = new DiscountSyncDto();
		DiscountDao srcDiscountDao = discountSyncDto.getDiscountDao(
				MapperUtil.getObjectMapperInstance().convertValue(data, new TypeReference<DiscountSyncDto>() {
				}));
		DiscountDao destDiscountDao = discountRepository.findOneById(srcDiscountDao.getId());
		if (destDiscountDao == null) {
			int tempSrcDataSyncId = srcDiscountDao.getSrcSyncId();
			srcDiscountDao.setSrcSyncId(srcDiscountDao.getDestSyncId());
			srcDiscountDao.setDestSyncId(tempSrcDataSyncId);
			saveToDestinationDB(srcDiscountDao, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDiscountDao.getSrcSyncId(),
					srcDiscountDao.getDestSyncId(), destDiscountDao.getSrcSyncId(), destDiscountDao.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = srcDiscountDao.getSrcSyncId();
				srcDiscountDao.setSrcSyncId(srcDiscountDao.getDestSyncId());
				srcDiscountDao.setDestSyncId(tempSrcDataSyncId);
				saveToDestinationDB(srcDiscountDao, order);
			}
		}
	}

	/**
	 * @param sourceRole
	 * @param order
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	public void saveToDestinationDB(Object data, int order) {
		try {
			if (order == 0) {
				DiscountDao discount = (DiscountDao) data;
				if (discount.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
						|| discount.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())
						|| discount.getDiscountType()
								.equalsIgnoreCase(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())) {
					DiscountDao discount1 = discountRepository.findOneByDiscountCodeAndDiscountType(
							discount.getDiscountCode(), discount.getDiscountType());
					if (discount1 == null) {
						List<DiscountDao> discountDaos = discountRepository
								.findActiveDiscounts(discount.getDiscountType());
						if (!discountDaos.isEmpty()) {
							discountDaos.forEach(dis -> {
								dis.setIsActive(false);
							});
							discountRepository.saveAll(discountDaos);
						}

					}

				}

				discountRepository.save(discount);
			} else if (order == 1) {
				discountLocationMappingRepository.save((DiscountLocationMappingDao) data);
			} else if (order == 2) {
				updateDiscountDetails((List<DiscountDetailsDao>) data);
			} else if (order == 3) {
				discountProductCategoryMappingRepository.saveAll((List<DiscountProductCategoryMappingDao>) data);
			} else if (order == 4) {
				discountItemMappingRepository.saveAll((List<DiscountItemMappingDao>) data);
			} else if (order == 5) {
				discountProductGroupMappingRepository.saveAll((List<DiscountProductGroupMappingDao>) data);
			} else if (order == 6) {
				discountExcludeMappingRepository.saveAll((List<DiscountExcludeMappingDao>) data);
			} else if (order == 7) {
				linkingDiscountsRepository.saveAll((List<LinkingDiscountsDao>) data);
			} else if (order == 8 || order == 9) {
				clubbingDiscountsRepository.deleteAll((List<ClubbingDiscountsDao>) data);
				clubbingDiscountsRepository.flush();
			} else if (order == 9) {
				clubbingDiscountsRepository.saveAll((List<ClubbingDiscountsDao>) data);
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

	private void updateDiscountDetails(List<DiscountDetailsDao> data) {
		// temporary fix: as rowId gets updated when new record is added in between, set
		// rowId = null first then save actual rowId
		List<DiscountDetailsDao> setRowIdToNullList = new ArrayList<>();
		
		if (!CollectionUtils.isEmpty(data)) {
			
			data.forEach(updateSlab -> {

				DiscountDetailsDao slabUpdateDao = (DiscountDetailsDao) MapperUtil
						.getObjectMapping(updateSlab,new DiscountDetailsDao());
				slabUpdateDao.setRowId(null);
				setRowIdToNullList.add(slabUpdateDao);
			});

			discountDetailsRepository.saveAll(setRowIdToNullList);
			discountDetailsRepository.flush();

		}

		if (!CollectionUtils.isEmpty(data)) {
			discountDetailsRepository.saveAll(data);
			discountDetailsRepository.flush();

		}
	}

}
