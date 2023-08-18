/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.inventory.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.constant.InventoryDetailsActionEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.BinListEnum;
import com.titan.poss.inventory.dto.constants.BinRequestType;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.response.InvWeightAndQuantityDto;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.QtyAndWeightDto;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.EngineService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class InventoryServiceImpl implements InventoryService {

	@Autowired
	@Qualifier("inventoryJdbcTemplate")
	NamedParameterJdbcTemplate namedparameterjdbctemplate;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepository;

	@Autowired
	private BinService binService;

	@Autowired
	EngineService engineService;

	@Autowired
	InventoryEngineService inventoryEngineService;

	@Value("${app.name}")
	private String appType;

	@Autowired
	private SalesSyncStagingRepository salesSyncStagingRepository;
	
	@Autowired
	private BusinessDayService businessDayService;

	@Override
	@Transactional
	public List<InventoryDetailsDao> removeFromInventoryDetails(List<UpdateInventoryDto> removeInventoryDto,
			Integer docNo, SalesDocTypeEnum docType) {
		List<String> ids = new ArrayList<>();
		for (UpdateInventoryDto r : removeInventoryDto) {
			ids.add(r.getId());
		}
		List<InventoryDetailsDao> inventoryDetailsList = listInventoryDetails(ids);
		Map<String, InventoryDetailsDao> mapInvDetails = mapInventoryDetails(inventoryDetailsList);

		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();
		List<String> invalidIds = new ArrayList<>();
		String correlationId = UUID.randomUUID().toString();
		for (UpdateInventoryDto r : removeInventoryDto) {

			if (!mapInvDetails.containsKey(r.getId())
					|| mapInvDetails.get(r.getId()).getTotalQuantity() < r.getTotalQuantity()) {
				invalidIds.add(r.getId());
			} else {
				InventoryDetailsDao invDetail = mapInvDetails.get(r.getId());
				invDetail.setTotalValue(invDetail.getTotalValue()
						.subtract(invDetail.getStdValue().multiply(new BigDecimal(r.getTotalQuantity()))));
				invDetail.setTotalWeight(invDetail.getTotalWeight()
						.subtract(invDetail
								.getTotalWeight().divide(new BigDecimal(invDetail.getTotalQuantity()),
										DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE)
								.multiply(new BigDecimal(r.getTotalQuantity()))));
				invDetail.setTotalQuantity((short) (invDetail.getTotalQuantity() - r.getTotalQuantity()));
				invDetail.setSrcSyncId(invDetail.getSrcSyncId() + 1);
				invDetail.setCorrelationId(correlationId);
				invDetail.setDocNumber(docNo);
				invDetail.setDocType(docType.name());
				invDetail.setActionType(InventoryDetailsActionEnum.REMOVE.name());

				inventoryDetails.add(invDetail);
			}

		}
		if (!invalidIds.isEmpty()) {
			throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
					"Invalid inventory ids: " + invalidIds);
		}

		inventoryDetails = inventoryDetailsRepository.saveAll(inventoryDetails);
		inventoryDetailsRepository.flush();// added save and flush as constraint violations in inventory are not rolling
											// back sales DB changes
		return inventoryDetails;
	}

	@Transactional(readOnly = true)
	public List<InventoryDetailsDao> listInventoryDetails(List<String> ids) {
		return inventoryDetailsRepository.findAllById(ids);

	}

	public Map<String, InventoryDetailsDao> mapInventoryDetails(List<InventoryDetailsDao> inventoryDetails) {
		return inventoryDetails.stream()
				.collect(Collectors.toMap(InventoryDetailsDao::getId, invDetails -> invDetails));
	}

	@Override
	@Transactional
	public List<InventoryDetailsDao> addInventoryDetails(List<InventoryDetailsDao> inventoryDetails, Integer docNo,
			SalesDocTypeEnum docType, Short fiscalYear) {
		String correlationId = UUID.randomUUID().toString();
		inventoryDetails.forEach(inventoryDetail -> {
			inventoryDetail.setDocNumber(docNo);
			inventoryDetail.setFiscalYear(fiscalYear);
			inventoryDetail.setDocType(docType.name());
			inventoryDetail.setActionType(InventoryDetailsActionEnum.ADD.name());
			inventoryDetail.setCorrelationId(correlationId);
		});
		inventoryDetails = inventoryDetailsRepository.saveAll(inventoryDetails);
		inventoryDetailsRepository.flush();// added save and flush as constraint violations in inventory are not rolling
											// back sales DB changes

		return inventoryDetails;

	}

	@Override
	public InventoryItemDtoList listInventoryItemsCount(ListInventoryItemsDto listInventoryItemsDto, String binType) {
	//	AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	//	UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		List<String> binGroups = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			//binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
            binGroups.add(null);
		} else if (binType.equals(BinListEnum.ADJ.toString()) || binType.equals(BinListEnum.PSV.toString())) {
			binGroups.add(BinGroupEnum.STN.toString());
		} else if (binType.equals(BinListEnum.ISSUE_TO_CFA.toString())) {
			// adding list of specific bin code from which items can be searched
			binGroups.add(BinGroupEnum.DEFECTIVE.toString());
			binGroups.add(BinGroupEnum.DISPUTE.toString());
			binGroups.add(BinGroupEnum.PURCFA.toString());
		} else {
			binGroups.add(null);
		}
		return inventoryDetailsRepository.getInventoryItemsCount(listInventoryItemsDto.getBinCode(),
				listInventoryItemsDto.getItemCode(), listInventoryItemsDto.getProductCategory(),
				listInventoryItemsDto.getProductGroup(), listInventoryItemsDto.getBinGroupCode(),
				listInventoryItemsDto.getLotNumber(), CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				binGroups);
	}
	
	@Override
	public InventoryItemDtoList listBintoBinAllowedItemsCount(ListInventoryItemsDto listInventoryItemsDto, String binType) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		List<String> binGroups = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
         } else if (binType.equals(BinListEnum.ADJ.toString()) || binType.equals(BinListEnum.PSV.toString())) {
			binGroups.add(BinGroupEnum.STN.toString());
		} else if (binType.equals(BinListEnum.ISSUE_TO_CFA.toString())) {
			// adding list of specific bin code from which items can be searched
			binGroups.add(BinGroupEnum.DEFECTIVE.toString());
			binGroups.add(BinGroupEnum.DISPUTE.toString());
			binGroups.add(BinGroupEnum.PURCFA.toString());
		} else {
			binGroups.add(null);
		}
		return inventoryDetailsRepository.getInventoryItemsCount(listInventoryItemsDto.getBinCode(),
				listInventoryItemsDto.getItemCode(), listInventoryItemsDto.getProductCategory(),
				listInventoryItemsDto.getProductGroup(), listInventoryItemsDto.getBinGroupCode(),
				listInventoryItemsDto.getLotNumber(), CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				binGroups);
	}

	@Override
	public Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> getInvCoinDetails(
			Map<ItemCodeInvWeightDto, SalesItemDto> coinsItemCodeAndWeightMap, List<String> saleableBinGroupList,
			Boolean isReserverdBin) {

		// convert AB/CO to CM, then TEP sale bin cannot be considered.
		if (isReserverdBin == null) {
			isReserverdBin = false;
		}

		Set<String> itemCodeSet = coinsItemCodeAndWeightMap.keySet().stream().map(ItemCodeInvWeightDto::getItemCode)
				.collect(Collectors.toSet());

		// within inventory query TEPSALE bin is also handled
		List<InventoryDetailsDao> invDetailsList = inventoryDetailsRepository
				.findByItemCodeInAndLocationCodeAndBinGroupCode(itemCodeSet, CommonUtil.getLocationCode(),
						saleableBinGroupList, isReserverdBin);

		Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> mapInvCoinDetails = new HashMap<>();

		// group invDao based on itemCode in asc order of totalQuantity
		coinsItemCodeAndWeightMap.forEach((itemCodeAndWeightDto, salesItemdto) -> {
			List<InventoryDetailsDao> itemInvDaoList = new ArrayList<>();
			for (InventoryDetailsDao invDao : invDetailsList) {
				if (itemCodeAndWeightDto.getItemCode().equals(invDao.getItemCode())
						&& (invDao.getTotalQuantity() > 0 && itemCodeAndWeightDto.getInventoryWeight()
								.compareTo(invDao.getTotalWeight().divide(BigDecimal.valueOf(invDao.getTotalQuantity()),
										DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE)) == 0)
						&& ((BooleanUtils.isTrue(salesItemdto.getIsHallmarked())
								&& BooleanUtils.isTrue(invDao.getIsHallmarked())) // when 'isHallmarked' is true, only
																					// hallmarked products to be picked.
								|| !BooleanUtils.isTrue(salesItemdto.getIsHallmarked()))) {
					itemInvDaoList.add(invDao);
				}
			}

			mapInvCoinDetails.put(itemCodeAndWeightDto, itemInvDaoList);
		});

		return mapInvCoinDetails;

	}

	// Moved to sales
	@Override
	public PagedRestResponse<List<InventoryBinDto>> listBins(String name, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		//UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		Map<String, String> productGroupList = inventoryEngineService.getProductGroups(null);
		Map<String, String> productCategoryList = inventoryEngineService.getProductCategories();
		CountryDetailsDto countryDto = getCountryDetails(authUser.getLocationCode());
		Page<InventoryBinDto> binList = null;
		List<String> binConstraints = new ArrayList<>();
		List<InventoryBinDto> inventoryBinDto = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binConstraints.add(null);
			//binConstraints.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
		} else {
			binConstraints.add(null);
		}
		if (inventorySearchCategory.equals(InventorySearchCategoryEnum.BINCODE)) {
			binList = inventoryDetailsRepository.listBinsByBincode(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), name, binConstraints, pageable);
			for (InventoryBinDto inv : binList) {
				inv.setWeightUnit(countryDto.getWeightUnit());
				inventoryBinDto.add(inv);
			}
		}
		if (inventorySearchCategory.equals(InventorySearchCategoryEnum.PRODUCTCATEGORY)) {
			binList = inventoryDetailsRepository.listBinsByProductCategory(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), name, binConstraints, pageable);
			for (InventoryBinDto inv : binList) {
				inv.setWeightUnit(countryDto.getWeightUnit());
				inv.setDescription(productCategoryList.get(inv.getName()));
				inventoryBinDto.add(inv);
			}
		}
		if (inventorySearchCategory.equals(InventorySearchCategoryEnum.PRODUCTGROUP)) {
			binList = inventoryDetailsRepository.listBinsByProductGroup(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), name, binConstraints, pageable);
			for (InventoryBinDto inv : binList) {
				inv.setWeightUnit(countryDto.getWeightUnit());
				inv.setDescription(productGroupList.get(inv.getName()));
				inventoryBinDto.add(inv);
			}
		}
		if (binList == null) {
			throw new ServiceException("Improper DB data", "ERR-INV-014");
		}
		return new PagedRestResponse<>(inventoryBinDto, binList);

	}

	// moved to sales
	@Override
	public Page<InventoryDetailsDao> listInventoryItems(ListInventoryItemsDto listInventoryItemsDto, String binType,
			Pageable pageable) {
		// AuthUser authUser = (AuthUser)
		// SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		// UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class,
		// authUser.getLocType());
		List<String> binGroups = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binGroups.add(null);
			// binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(),
			// userType));
		} else if (binType.equals(BinListEnum.ADJ.toString()) || binType.equals(BinListEnum.PSV.toString())) {
			binGroups.add(BinGroupEnum.STN.toString());
		} else if (binType.equals(BinListEnum.ISSUE_TO_CFA.toString())) {
			// adding list of specific bin code from which items can be searched
			binGroups.add(BinGroupEnum.DEFECTIVE.toString());
			binGroups.add(BinGroupEnum.DISPUTE.toString());
			binGroups.add(BinGroupEnum.PURCFA.toString());
		} else {
			binGroups.add(null);
		}
		return inventoryDetailsRepository.getInventoryItems(listInventoryItemsDto.getBinCode(),
				listInventoryItemsDto.getItemCode(), listInventoryItemsDto.getProductCategory(),
				listInventoryItemsDto.getProductGroup(), listInventoryItemsDto.getBinGroupCode(),
				listInventoryItemsDto.getLotNumber(), CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				binGroups, pageable);
	}

	@Override
	public boolean isValidForUpdate(String binGroupCode, InventoryDetailsDao inventoryDetails) {
		boolean valid = true;

		if (!BinGroupEnum.receiveBin(UserTypeEnum.valueOf(CustomSecurityPrincipal.getSecurityPrincipal().getLocType()))
				.contains(binGroupCode)) {
			throw new ServiceException("INVALID RECEIVING BIN CODE", "ERR-INV-010");
		}
		if (binGroupCode.equalsIgnoreCase(BinGroupEnum.TEPSALE.toString())
				&& !ProductGroupCodeEnum.getCoinList().contains(inventoryDetails.getProductGroup())) {
			valid = false;
		}
		return valid;
	}

	/**
	 * @param inventoryDetailsDaos
	 */
	@Override
	public List<SyncStagingDto> updateInventoryAndSaveToStaging(List<InventoryDetailsDao> inventoryDetailsDaos,
			Integer stockTransactionId) {
		inventoryDetailsDaos = inventoryDetailsRepository.saveAll(inventoryDetailsDaos);
		List<SyncStagingDto> syncStagingDtoList = new ArrayList<>();
		List<SyncStaging> stagingMessageList = new ArrayList<>();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType)) {

			final int chunkSize = 10;
			final AtomicInteger counter = new AtomicInteger();
			final Collection<List<InventoryDetailsDao>> chunkLists = inventoryDetailsDaos.stream()
					.collect(Collectors.groupingBy(data -> counter.getAndIncrement() / chunkSize)).values();
			chunkLists.forEach(chunck -> {
				SyncStagingDto syncStagingDto = new SyncStagingDto();
				InventoryDetailsSyncDtoExt inventorySyncDto = new InventoryDetailsSyncDtoExt();
				List<SyncData> syncDatas = new ArrayList<>();
				syncDatas.add(
						DataSyncUtil.createSyncData(inventorySyncDto.getSyncDtoExtList(chunck, stockTransactionId), 0));
				List<String> destinations = new ArrayList<>();
				destinations.add("EPOSS");
				MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
						InventoryOperationCodes.INV_BIN_BIN_EPOSS_ADD, destinations, MessageType.FIFO.toString(),
						DestinationType.SELECTIVE.toString());
				syncStagingDto.setMessageRequest(messageRequest);
				String requestBody = MapperUtil.getJsonString(messageRequest);
				SyncStaging stagingMessage = new SyncStaging();
				stagingMessage.setMessage(requestBody);
				stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				stagingMessageList.add(stagingMessage);
				syncStagingDto.setId(stagingMessage.getId());
				syncStagingDtoList.add(syncStagingDto);
			});
			salesSyncStagingRepository.saveAll(stagingMessageList);
		}

		return syncStagingDtoList;
	}

	@Override
	@Transactional
	public List<InventoryDetailsDao> updateBinById(List<UpdateInventoryDto> inventoryDto, String destinationBin,
			boolean isPreviousBin) {

		List<String> ids = new ArrayList<>();
		for (UpdateInventoryDto r : inventoryDto) {
			ids.add(r.getId());
		}
		List<InventoryDetailsDao> inventoryDetailsList = listInventoryDetails(ids);
		Map<String, InventoryDetailsDao> mapInvDetails = mapInventoryDetails(inventoryDetailsList);

		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();
		List<String> invalidIds = new ArrayList<>();
		String cId = UUID.randomUUID().toString();
		for (UpdateInventoryDto r : inventoryDto) {
			if (!mapInvDetails.containsKey(r.getId())
					|| mapInvDetails.get(r.getId()).getTotalQuantity() < r.getTotalQuantity()) {
				invalidIds.add(r.getId());
			} else {
				InventoryDetailsDao invDetail = mapInvDetails.get(r.getId());
				invDetail.setCorrelationId(cId);
				invDetail.setSrcSyncId(invDetail.getSrcSyncId() + 1);
				BigDecimal totalWeight = invDetail.getTotalWeight().divide(new BigDecimal(invDetail.getTotalQuantity()),  MathContext.DECIMAL128)
						.multiply(new BigDecimal(r.getTotalQuantity()));

				invDetail.setTotalWeight(invDetail.getTotalWeight()
						.subtract(invDetail.getTotalWeight().divide(new BigDecimal(invDetail.getTotalQuantity()), MathContext.DECIMAL128)
								.multiply(new BigDecimal(r.getTotalQuantity()))));
				BigDecimal totalValue = invDetail.getTotalValue()
						.divide(new BigDecimal(invDetail.getTotalQuantity()), MathContext.DECIMAL128)
						.multiply(new BigDecimal(r.getTotalQuantity()));
				invDetail.setTotalValue(invDetail.getTotalValue()
						.subtract(invDetail.getStdValue().multiply(new BigDecimal(r.getTotalQuantity()))));
				invDetail.setTotalQuantity((short) (invDetail.getTotalQuantity() - r.getTotalQuantity()));
				inventoryDetails.add(invDetail);
				InventoryDetailsDao newInventoryDetail = (InventoryDetailsDao) MapperUtil.getObjectMapping(invDetail,
						new InventoryDetailsDao());
				newInventoryDetail.setCorrelationId(cId);
				newInventoryDetail.setSrcSyncId(0);
				newInventoryDetail.setDestSyncId(0);
				newInventoryDetail.setTotalWeight(totalWeight);
				newInventoryDetail.setTotalValue(totalValue);
				newInventoryDetail.setTotalQuantity(r.getTotalQuantity());
				newInventoryDetail.setBinModifiedDate(new Date());
				newInventoryDetail.setId(UUID.randomUUID().toString());
				if (isPreviousBin) {
					String prevBinCode = newInventoryDetail.getPreviousBinCode();
					String prevBinGrup = newInventoryDetail.getPreviousBinGroupCode();
					newInventoryDetail.setPreviousBinCode(newInventoryDetail.getBinCode());
					newInventoryDetail.setPreviousBinGroupCode(newInventoryDetail.getBinGroupCode());
					newInventoryDetail.setBinCode(prevBinCode);
					newInventoryDetail.setBinGroupCode(prevBinGrup);
				} else {
					newInventoryDetail.setPreviousBinCode(invDetail.getBinCode());
					newInventoryDetail.setPreviousBinGroupCode(invDetail.getBinGroupCode());
					newInventoryDetail.setBinGroupCode(destinationBin);
					newInventoryDetail.setBinCode(destinationBin);
				}
				inventoryDetails.add(newInventoryDetail);
			}

		}
		if (!invalidIds.isEmpty()) {
			throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
					"Invalid inventory ids: " + invalidIds);
		}
		inventoryDetails = inventoryDetailsRepository.saveAll(inventoryDetails);
		inventoryDetailsRepository.flush();// added save and flush as constraint violations in inventory are not rolling
											// back sales DB changes

		return inventoryDetails;
	}

	@Override
	public InvWeightAndQuantityDto checkIfItemIsInStock(String id, String itemCode, BigDecimal inventoryWeight,
			String coinProductGroupCode, Short totalQuantity, Boolean isCoinStockCheck) {

		InvWeightAndQuantityDto itemCodeAndQuantityDto = null;

		if (BooleanUtils.isTrue(isCoinStockCheck)) {

			List<InvWeightAndQuantityDto> itemCodeAndQuantityDtoList = inventoryDetailsRepository
					.findCoinByItemCodeAndProductGroupAndLocationCode(itemCode, coinProductGroupCode,
							CommonUtil.getLocationCode());

			if (CollectionUtil.isEmpty(itemCodeAndQuantityDtoList)) {
				return new InvWeightAndQuantityDto((long) 0, BigDecimal.ZERO, false);
			}

			itemCodeAndQuantityDto = getTotaQtyDetailForCoin(inventoryWeight, totalQuantity,
					itemCodeAndQuantityDtoList);

		} else {
			QtyAndWeightDto qtyAndWeightDto = inventoryDetailsRepository.findOneByIdAndLocationCode(id,
					CommonUtil.getLocationCode());

			if (qtyAndWeightDto == null) {
				return new InvWeightAndQuantityDto((long) 0, BigDecimal.ZERO, false);
			}

			itemCodeAndQuantityDto = new InvWeightAndQuantityDto(qtyAndWeightDto.getTotalQuantity().longValue(),
					qtyAndWeightDto.getInventoryWeight());

			// set isItemInStock based on totalQuantity
			itemCodeAndQuantityDto.setIsItemInStock((totalQuantity) <= (itemCodeAndQuantityDto.getTotalQuantity()));
		}

		return itemCodeAndQuantityDto;
	}

	/**
	 * This method will get totalQuantity details for coins.
	 * 
	 * @param inventoryWeight
	 * @param totalQuantity
	 * @param itemCodeAndQuantityDtoList
	 * @return ItemCodeAndQuantityDto
	 */
	private InvWeightAndQuantityDto getTotaQtyDetailForCoin(BigDecimal inventoryWeight, Short totalQuantity,
			List<InvWeightAndQuantityDto> itemCodeAndQuantityDtoList) {

		InvWeightAndQuantityDto itemCodeAndQuantityDto = null;

		// check if required quantity exists based on inventoryWeight
		List<InvWeightAndQuantityDto> itemCodeAndQuantityFilterByWghtAndQty = itemCodeAndQuantityDtoList.stream()
				.filter(coin -> (inventoryWeight.compareTo(coin.getInventoryWeight()) == 0
						&& (totalQuantity) <= (coin.getTotalQuantity())))
				.collect(Collectors.toList());

		if (CollectionUtil.isEmpty(itemCodeAndQuantityFilterByWghtAndQty)) {
			return new InvWeightAndQuantityDto((long) 0, BigDecimal.ZERO, false);

		}

		itemCodeAndQuantityDto = itemCodeAndQuantityFilterByWghtAndQty.get(0);
		itemCodeAndQuantityDto.setIsItemInStock(true);
		return itemCodeAndQuantityDto;
	}

	@Override
	public List<InventoryDetailsDao> getItemsByIdAndLocationCode(List<String> idList) {
		return inventoryDetailsRepository.getItemsByIdAndLocationCode(idList,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
	}

	@Override
	public List<InventoryDetailsDao> getReserveBinItemsList(String binCode, String locationCode, Integer numberOfDays) {
		return inventoryDetailsRepository.getReserveBinItemsList(binCode, locationCode, numberOfDays);
	}

	@Override
	public List<InventoryDetailsDao> getInventoryDetails(List<String> inventoryIds) {
		return inventoryDetailsRepository.getInventoryDetails(inventoryIds);
	}

	@Override
	@Transactional
	public List<InventoryDetailsDao> updateInventoryCutPeice(InventoryDetailsDao inventoryDetailsDao, Integer docNo,
			String inventoryId, Map<String, StandardPriceResponseDto> goldRate,
			CutPieceTepPriceResponseDto cutPieceTepPriceResponse,String transactionType,StockTransactionDetailsDaoExt stockTransactionDetails) {
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		InventoryDetailsDao tempInventoryDetails = inventoryDetailsDao;
		tempInventoryDetails.setTotalQuantity((short) 1);
		String correlationId = UUID.randomUUID().toString();
		BusinessDayDto buisnessDayDto =businessDayService.getBusinessDay(); 
		Date businessDate = buisnessDayDto.getBusinessDate();
		Integer fiscalYear = buisnessDayDto.getFiscalYear();
		// Check inventory for total number of items
		if (inventoryDetailsDao.getTotalQuantity() > 1) {
			for (int i = 0; i < inventoryDetailsDao.getTotalQuantity() - 1; i++) {
				tempInventoryDetails.setId(UUID.randomUUID().toString());
				tempInventoryDetails.setCorrelationId(correlationId);
				tempInventoryDetails.setTotalWeight(tempInventoryDetails.getStdWeight());
				tempInventoryDetails.setTotalValue(tempInventoryDetails.getStdValue());
				inventoryDetailsList.add(tempInventoryDetails);
			}
		}
		InventoryDetailsDao inventoryUpdatedDetails = setValuesToInventoryUpdatedDetails(docNo, inventoryDetailsDao,
				new InventoryDetailsDao(), correlationId, cutPieceTepPriceResponse,transactionType);
		InventoryDetailsDao inventoryCutPieceDetails = setValuesToInventoryCutPieceDetails(docNo, inventoryDetailsDao,
				new InventoryDetailsDao(), correlationId, cutPieceTepPriceResponse, businessDate,transactionType,fiscalYear,stockTransactionDetails);

		inventoryDetailsList.add(inventoryUpdatedDetails);
		inventoryDetailsList.add(inventoryCutPieceDetails);
	
		inventoryDetailsRepository.saveAll(inventoryDetailsList);
		inventoryDetailsRepository.flush();

		return inventoryDetailsList;
	}

	private InventoryDetailsDao setValuesToInventoryCutPieceDetails(Integer docNo, InventoryDetailsDao inventoryDetails,
			InventoryDetailsDao inventoryCutPieceDetails,String correlationId, CutPieceTepPriceResponseDto cutPieceTepPriceResponse,
			Date businessDate,String transactionType,Integer fiscalYear,StockTransactionDetailsDaoExt stockTransactionDetails) {
		JsonData totalWeightDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(inventoryDetails.getTotalWeightDetails()), JsonData.class);
		WeightDetailsDto weightDto = MapperUtil.mapObjToClass(totalWeightDetails.getData(), WeightDetailsDto.class);
		inventoryCutPieceDetails = (InventoryDetailsDao) MapperUtil.getDtoMapping(inventoryDetails,InventoryDetailsDao.class);
		weightDto.setGoldWeight(cutPieceTepPriceResponse.getCutPieceWeight());
		weightDto.setStoneWeight(BigDecimal.ZERO);
		weightDto.setMaterialWeight(BigDecimal.ZERO);
		weightDto.setDiamondWeight(BigDecimal.ZERO);
		weightDto.setPlatinumWeight(BigDecimal.ZERO);
		weightDto.setSilverWeight(BigDecimal.ZERO);
		JsonData weightDetails = new JsonData();
		weightDetails.setType("WEIGHT_DETAILS");
		weightDetails.setData(weightDto);
		
		inventoryCutPieceDetails.setId(UUID.randomUUID().toString());
		inventoryCutPieceDetails.setSerialNumber(cutPieceTepPriceResponse.getCutPieceWeight().toString());
//		inventoryCutPieceDetails.setMfgDate(businessDate);
		inventoryCutPieceDetails.setTotalWeight(cutPieceTepPriceResponse.getCutPieceWeight());
		inventoryCutPieceDetails.setStdWeight(cutPieceTepPriceResponse.getCutPieceWeight());
		inventoryCutPieceDetails.setTotalValue(cutPieceTepPriceResponse.getCutPieceValue());
		inventoryCutPieceDetails.setStdValue(cutPieceTepPriceResponse.getCutPieceValue());
		inventoryCutPieceDetails.setBinModifiedDate(businessDate);
		inventoryCutPieceDetails.setStockInwardDate(businessDate);
		inventoryCutPieceDetails.setCorrelationId(correlationId);
		inventoryCutPieceDetails.setTotalQuantity((short)1);
		inventoryCutPieceDetails.setTotalWeightDetails(MapperUtil.getJsonString(weightDetails));
		inventoryCutPieceDetails.setLotNumber(inventoryCutPieceDetails.getLotNumber()+"CP");
		inventoryCutPieceDetails.setItemCode(stockTransactionDetails.getItemCode());
		inventoryCutPieceDetails.setDocNumber(docNo);
		inventoryCutPieceDetails.setDocType(transactionType);
		inventoryCutPieceDetails.setBinCode(BinGroupEnum.CUTPIECE.name());
		inventoryCutPieceDetails.setBinGroupCode(BinGroupEnum.TEP.name());
		inventoryCutPieceDetails.setFiscalYear(Short.valueOf(fiscalYear.toString()));
		inventoryCutPieceDetails.setMfgDate(businessDate);
		inventoryCutPieceDetails.setKarat(cutPieceTepPriceResponse.getKarat());
		inventoryCutPieceDetails.setActionType(InventoryDetailsActionEnum.ADD.name());
//		inventoryCutPieceDetails.setActionType(inventoryDetails.getActionType());
		
//		inventoryCutPieceDetails.setCurrencyCode(inventoryDetails.getCurrencyCode());	
//		inventoryCutPieceDetails.setItemCode(inventoryDetails.getItemCode());
//		inventoryCutPieceDetails.setItemDetails(inventoryDetails.getItemDetails());	
//		inventoryCutPieceDetails.setLocationCode(inventoryDetails.getLocationCode());
	
//		inventoryCutPieceDetails.setProductCategory(inventoryDetails.getProductCategory());
//		inventoryCutPieceDetails.setProductGroup(inventoryDetails.getProductGroup());
//		inventoryCutPieceDetails.setWeightUnit(inventoryDetails.getWeightUnit());
//		inventoryCutPieceDetails.setCurrencyCode(inventoryDetails.getCurrencyCode());
//		inventoryCutPieceDetails.setOrgCode(inventoryDetails.getOrgCode());
		return inventoryCutPieceDetails;
	}

	private InventoryDetailsDao setValuesToInventoryUpdatedDetails(Integer docNo, InventoryDetailsDao inventoryDetails,
			InventoryDetailsDao inventoryUpdatedDetails,String correlationId, CutPieceTepPriceResponseDto cutPieceTepPriceResponse,String transactionType) {
		
		JsonData totalWeightDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(inventoryDetails.getTotalWeightDetails()), JsonData.class);
		WeightDetailsDto weightDto = MapperUtil.mapObjToClass(totalWeightDetails.getData(), WeightDetailsDto.class);
		weightDto.setGoldWeight(cutPieceTepPriceResponse.getNetWeightAfterCutPiece());
		JsonData weightDetails = new JsonData();
		weightDetails.setType("WEIGHT_DETAILS");
		weightDetails.setData(weightDto);
		inventoryUpdatedDetails = (InventoryDetailsDao) MapperUtil.getDtoMapping(inventoryDetails,InventoryDetailsDao.class);
		
		int weightCount = inventoryUpdatedDetails.getWeightModifiedCount()!=null?inventoryUpdatedDetails.getWeightModifiedCount():0 + 1;
		
		inventoryUpdatedDetails.setCorrelationId(correlationId);
		inventoryUpdatedDetails.setTotalQuantity((short)1);
		inventoryUpdatedDetails.setTotalWeightDetails(MapperUtil.getJsonString(weightDetails));
		inventoryUpdatedDetails.setSerialNumber(cutPieceTepPriceResponse.getNetWeightAfterCutPiece().toString());
		inventoryUpdatedDetails.setTotalWeight(cutPieceTepPriceResponse.getNetWeightAfterCutPiece());
		inventoryUpdatedDetails.setTotalValue(cutPieceTepPriceResponse.getSoldItemValue());	
		inventoryUpdatedDetails.setWeightModifiedCount((short) weightCount);
		inventoryUpdatedDetails.setDocNumber(docNo);
		inventoryUpdatedDetails.setDocType(transactionType);
		inventoryUpdatedDetails.setLotNumber(inventoryUpdatedDetails.getLotNumber()+"CP");
		inventoryUpdatedDetails.setStdValue(cutPieceTepPriceResponse.getSoldItemValue());
		inventoryUpdatedDetails.setStdWeight(cutPieceTepPriceResponse.getNetWeightAfterCutPiece());
		inventoryUpdatedDetails.setSrcSyncId(inventoryUpdatedDetails.getSrcSyncId() + 1);
//		inventoryUpdatedDetails.setDestSyncId(inventoryUpdatedDetails.getDestSyncId()+1);
//		inventoryUpdatedDetails.setId(UUID.randomUUID().toString());
//		inventoryUpdatedDetails.setStdValue(totalNetValue);
//		inventoryUpdatedDetails.setProductCategory(inventoryDetails.getProductCategory());
//		inventoryUpdatedDetails.setProductGroup(inventoryDetails.getProductGroup());
//		inventoryUpdatedDetails.setWeightUnit(inventoryDetails.getWeightUnit());
//		inventoryUpdatedDetails.setCurrencyCode(inventoryDetails.getCurrencyCode());
//		inventoryUpdatedDetails.setOrgCode(inventoryDetails.getOrgCode());
//		inventoryUpdatedDetails.setStdWeight(totalNetWt);

		return inventoryUpdatedDetails;

	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	@Override
	public List<InventoryDetailsDao> getItemsByItemCodeAndLotNumber(String itemCode, String lotNumber) {

		return inventoryDetailsRepository.findAllByLocationCodeAndItemCodeAndLotNumber(CommonUtil.getStoreCode(),
				itemCode, lotNumber);
	}

	@Override
	public InventoryDetailsDao getItemByIdAndLocationCode(String id) {
		// TODO Auto-generated method stub
		return inventoryDetailsRepository.getItemByIdAndLocationCode(id,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
	}
	
	@Override
	public List<InventoryDetailsDao> getItemsByItemCodeAndBinGroupCodeAndLocationCode(String itemCode,String binGroupCode, String locationCode) {
		
		return inventoryDetailsRepository.getItemsByItemCodeAndBinGroupCodeAndLocationCode(itemCode,binGroupCode,locationCode);
	}

}
