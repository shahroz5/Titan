/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dto.InventoryDetailsDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.BinListEnum;
import com.titan.poss.inventory.dto.constants.BinRequestType;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.BinUpdateBulkDto;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.response.AvailableBinCode;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationListDto;
import com.titan.poss.inventory.repository.InventoryDetailsRepositoryExt;
import com.titan.poss.inventory.service.BinService;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("inventoryDetailsService")
public class InventoryDetailsServiceImpl implements InventoryDetailsService {

	@Autowired
	private InventoryDetailsRepositoryExt inventoryDetailsRepository;

	@Autowired
	NamedParameterJdbcTemplate namedparameterjdbctemplate;

	@Autowired
	private BinService binService;

	@Autowired
	EngineService engineService;

	@Override
	public PagedRestResponse<List<InventoryBinDto>> listBins(String binCode, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		Page<InventoryBinDto> binList = null;
		List<String> binConstraints = new ArrayList<>();
		List<InventoryBinDto> inventoryBinDto = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binConstraints.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
		} else {
			binConstraints.add(null);
		}
		if (inventorySearchCategory.equals(InventorySearchCategoryEnum.BINCODE)) {
			binList = inventoryDetailsRepository.listBinsByBincode(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), binCode, binConstraints,
					pageable);
			for (InventoryBinDto inv : binList) {
				inventoryBinDto.add(inv);
			}
		}
		if (inventorySearchCategory.equals(InventorySearchCategoryEnum.PRODUCTCATEGORY)) {
			binList = inventoryDetailsRepository.listBinsByProductCategory(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), binCode, binConstraints,
					pageable);
			for (InventoryBinDto inv : binList) {
				inv.setDescription(productCategoryList.get(inv.getName()));
				inventoryBinDto.add(inv);
			}
		}
		if (inventorySearchCategory.equals(InventorySearchCategoryEnum.PRODUCTGROUP)) {
			binList = inventoryDetailsRepository.listBinsByProductGroup(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), binCode, binConstraints,
					pageable);
			for (InventoryBinDto inv : binList) {
				inv.setDescription(productGroupList.get(inv.getName()));
				inventoryBinDto.add(inv);
			}
		}
		if (binList == null) {
			throw new ServiceException("Improper DB data", "ERR-INV-014");
		}
		return new PagedRestResponse<>(inventoryBinDto, binList);

	}

	@Override
	public Page<InventoryDetailsDaoExt> listInventoryItems(ListInventoryItemsDto listInventoryItemsDto, String binType,
			Pageable pageable) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		List<String> binGroups = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
		} else if (binType.equals(BinListEnum.ADJ.toString()) || binType.equals(BinListEnum.PSV.toString())) {
			// binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(),
			// userType));
			binGroups.add(BinGroupEnum.STN.toString());
		} else if (binType.equals(BinListEnum.ISSUE_TO_CFA.toString())) {
			// adding list of specific bin code from which items can be searched
			binGroups.add(BinGroupEnum.DEFECTIVE.toString());
			binGroups.add(BinGroupEnum.DISPUTE.toString());
			binGroups.add(BinGroupEnum.PURCFA.toString());
		}

		else {
			binGroups.add(null);
		}
		return inventoryDetailsRepository.getInventoryItems(listInventoryItemsDto.getBinCode(),
				listInventoryItemsDto.getItemCode(), listInventoryItemsDto.getProductCategory(),
				listInventoryItemsDto.getProductGroup(), listInventoryItemsDto.getBinGroupCode(),
				listInventoryItemsDto.getLotNumber(), CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				binGroups, pageable);
	}

	@Override
	public InventoryItemDtoList listInventoryItemsCount(ListInventoryItemsDto listInventoryItemsDto, String binType) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		List<String> binGroups = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
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
	public List<InventoryDetailsDaoExt> listAllInventoryItems(ListInventoryItemsDto listInventoryItemsDto,
			String binType) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		List<String> binGroups = new ArrayList<>();
		if (binType.equals(BinListEnum.BIN_BIN.toString())) {
			binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
		} else {
			binGroups.add(null);
		}
		return inventoryDetailsRepository.getAllInventoryItems(listInventoryItemsDto.getBinCode(),
				listInventoryItemsDto.getItemCode(), listInventoryItemsDto.getProductCategory(),
				listInventoryItemsDto.getProductGroup(), listInventoryItemsDto.getBinGroupCode(),
				listInventoryItemsDto.getLotNumber(), CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				binGroups);
	}

	@Override
	@Transactional
	public void updateBinInventoryItems(List<InventoryDetailsDaoExt> inventoryDetails) {
		List<InventoryDetailsDaoExt> inventoryDetails1 = new ArrayList<>();
		for (InventoryDetailsDaoExt inventoryDetail : inventoryDetails) {
			inventoryDetail.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			inventoryDetail.setLastModifiedDate(new Date());
			inventoryDetails1.add(inventoryDetail);
		}
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(inventoryDetails1.toArray());
		String s = "IF EXISTS(SELECT * FROM inventory_details WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code= :binCode AND id != :id) "
				+ " BEGIN UPDATE inventory_details SET bin_code = :binCode, bin_group_code = :binGroupCode,previous_bin_code = bin_code, previous_bin_group_code = bin_group_code, total_quantity= (:totalQuantity + inventory_details.total_quantity),total_weight= (:totalWeight + inventory_details.total_weight),total_value = (:totalValue + inventory_details.total_value),last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code = :binCode "
				+ " DELETE FROM inventory_details WHERE id = :id AND location_code = :locationCode END "
				+ " ELSE UPDATE inventory_details  SET bin_code = :binCode, bin_group_code = :binGroupCode, "
				+ " previous_bin_code = bin_code, previous_bin_group_code = bin_group_code,last_modified_by = :lastModifiedBy, "
				+ " last_modified_date = :lastModifiedDate " + " WHERE location_code = :locationCode AND id = :id ";
		namedparameterjdbctemplate.batchUpdate(s, batch);

	}

	@Override
	public List<InventoryDetailsDaoExt> getInventoryDetailsByIdList(List<String> inventortIds) {
		return inventoryDetailsRepository.findAllByIdIn(inventortIds);
	}

	@Override
	public List<InventoryDetailsDaoExt> getItemsByIdAndLocationCode(List<String> idList) {
		return inventoryDetailsRepository.getItemsByIdAndLocationCode(idList,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
	}

	@Override
	public boolean isValidForUpdate(String binGroupCode, InventoryDetailsDaoExt inventoryDetails) {
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

	@Override
	public List<InventoryDetailsDaoExt> findByBinCodeAndLocationCode(String bin, String locationCode) {
		return inventoryDetailsRepository.findByBinCodeAndLocationCode(locationCode, locationCode);
	}

	@Override
	public List<InventoryDetailsDaoExt> findByBinCodeAndProductGroupAndLocationCode(String bin, String productGroup,
			String locationCode) {
		return inventoryDetailsRepository.findByBinCodeAndProductGroupAndLocationCode(bin, productGroup, locationCode);
	}

	@Override
	public Optional<InventoryDetailsDaoExt> findById(String inventoryId) {
		return inventoryDetailsRepository.findById(inventoryId);
	}

	@Override
	public Optional<InventoryDetailsDaoExt> findOne(Example<InventoryDetailsDaoExt> criteria) {
		return inventoryDetailsRepository.findOne(criteria);
	}

	@Override
	public Optional<InventoryDetailsDaoExt> findByLocationCodeAndItemCodeAndLotNumber(String locationCode,
			String itemCode, String lotNumber) {
		return inventoryDetailsRepository.findByLocationCodeAndItemCodeAndLotNumber(locationCode, itemCode, lotNumber);
	}

	@Override
	public List<InventoryDetailsDaoExt> findAllByLocationCodeAndItemCodeAndBinGroupCodeIn(String srcLocationCode,
			String itemCode, List<String> binGroupList) {

		return inventoryDetailsRepository.findAllByLocationCodeAndItemCodeAndBinGroupCodeIn(srcLocationCode, itemCode,
				binGroupList);
	}
	
	@Override
	public List<InventoryDetailsDaoExt> getInventoryItemsDetailsList(String srcLocationCode,
			String itemCode, List<String> binGroupList) {

		return inventoryDetailsRepository.getInventoryItemsDetailsList(srcLocationCode, itemCode,
				binGroupList);
	}

	@Override
	@Transactional
	public void addInventoryDetails(List<InventoryDetailsDaoExt> inventoryDetails, Integer docNo, DocTypeEnum docType) {

		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(inventoryDetails.toArray());
		String q = "UPDATE inventory_details  SET total_quantity =  total_quantity + :totalQuantity , total_weight = total_weight + :totalWeight , total_value = total_value + :totalValue WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code = :binCode"
				+ " IF @@ROWCOUNT = 0 INSERT INTO inventory_details (id, location_code, item_code, lot_number, serial_number, mfg_date, total_quantity, total_weight, total_value, std_weight, std_value, org_code,bin_group_code, bin_code, bin_modified_date, product_group, product_category, weight_modified_count, item_details, weight_unit,"
				+ " currency_code, created_by, created_date, last_modified_by, last_modified_date,stock_inward_date,total_weight_details,isac_details,is_hallmarked) "
				+ "values (:id, :locationCode, :itemCode, :lotNumber, :serialNumber, :mfgDate, :totalQuantity, :totalWeight, :totalValue, :stdWeight, :stdValue, :orgCode, :binGroupCode, "
				+ ":binCode, :binModifiedDate, :productGroup, :productCategory, :weightModifiedCount, :itemDetails, :weightUnit, :currencyCode, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :stockInwardDate, :totalWeightDetails,:isacDetails,:isHallmarked)";
		namedparameterjdbctemplate.batchUpdate(q, batch);

	}

	@Override
	@Transactional
	public void removeFromInventoryDetails(List<InventoryDetailsDaoExt> inventoryDetails, Integer docNo,
			DocTypeEnum docType) {
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(inventoryDetails.toArray());

		// If Item available in inventory_details table with id and location code then
		// update the item's weight, quantity,value.
		// Delete the item when quantity is 0.
		String u = "IF EXISTS(SELECT * FROM inventory_details WHERE id = :id AND location_code = :locationCode) "
				+ "BEGIN "
				+ "UPDATE inventory_details  SET total_quantity =  total_quantity - :totalQuantity , total_weight = total_weight - :totalWeight , total_value = total_value - :totalValue WHERE id = :id AND location_code = :locationCode "
				+ "DELETE FROM inventory_details WHERE id = :id AND location_code = :locationCode AND total_quantity = 0 "
				+ "END ";

		namedparameterjdbctemplate.batchUpdate(u, batch);

	}

	@Override
	public List<ItemLocationListDto> getItemsAvailableLocationsList(List<String> itemList, String locationCode,
			Long requestCount, List<String> locationList, List<String> binGroupList) {

		return inventoryDetailsRepository.getItemsAvailableLocationsList(itemList, locationCode, requestCount,
				locationList, binGroupList);
	}

	@Override
	@Transactional
	public void updateBinInventoryItems(String source, String destination, String destinationBinGroup,
			InventorySearchCategoryEnum inventorySearchCategory, List<InventoryDetailsDaoExt> inventoryDetailLists,
			Integer docNo, DocTypeEnum docType) {
		List<InventoryDetailsDto> inventoryDetailsDto = new ArrayList<>();
		for (InventoryDetailsDaoExt inv : inventoryDetailLists) {
			InventoryDetailsDto invDto = (InventoryDetailsDto) MapperUtil.getDtoMapping(inv, InventoryDetailsDto.class);
			invDto.setDestinationBin(destination);
			invDto.setDestinationBinGroup(destinationBinGroup);
			invDto.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDto.setLastModifiedDate(new Date());
			inventoryDetailsDto.add(invDto);
		}
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(inventoryDetailsDto);

		String s = "IF EXISTS(SELECT * FROM inventory_details WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code= :destinationBin AND  id != :id) "
				+ " BEGIN UPDATE inventory_details SET bin_code = :destinationBin, bin_group_code = :destinationBinGroup,previous_bin_code = bin_code,previous_bin_group_code = bin_group_code,total_weight= (:totalWeight + inventory_details.total_weight),total_value = (:totalValue + inventory_details.total_value),"
				+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code = :destinationBin "
				+ " DELETE FROM inventory_details WHERE location_code = :locationCode AND id = :id END "
				+ " ELSE UPDATE inventory_details  SET previous_bin_code = bin_code,previous_bin_group_code = bin_group_code, bin_code = :destinationBin, bin_group_code = :destinationBinGroup, last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate WHERE location_code = :locationCode AND id = :id";

		namedparameterjdbctemplate.batchUpdate(s, batch);

	}

	@Override
	public List<AvailableBinCode> getAvailableBinCodesByLocation(String locationCode) {

		List<AvailableBinCode> availableQtyList = new ArrayList<>();
		List<Object[]> availableList = inventoryDetailsRepository.getAvailableBinCodesByLocation(locationCode);
		for (Object[] l : availableList) {
			AvailableBinCode is = new AvailableBinCode();
			is.setBinCode((String) l[0]);
			is.setQuantity((Integer) l[1]);

			availableQtyList.add(is);
		}
		return availableQtyList;

	}

	/*
	 * @Override public void addInventoryDtlsTrx(List<InventoryDetailsDaoExt>
	 * inventoryDetailLists, String binCode, Short fiscalYear, Integer docNo,
	 * DocTypeEnum docType, InventoryDetailsActionEnum actionType) {
	 * 
	 * List<InventoryTxnDetailsDao> invTxnDtls = new ArrayList<>(); for
	 * (InventoryDetailsDaoExt i : inventoryDetailLists) { InventoryTxnDetailsDao
	 * itx = new InventoryTxnDetailsDao(); if (binCode != null) {
	 * itx.setBinCode(binCode); } else { itx.setBinCode(i.getBinCode()); }
	 * itx.setFiscalYear(fiscalYear); itx.setItemCode(i.getItemCode());
	 * itx.setItemWeight(i.getStdWeight());
	 * itx.setLocationCode(i.getLocationCode()); itx.setLotNumber(i.getLotNumber());
	 * itx.setActionType(actionType.toString()); itx.setDocType(docType.name());
	 * itx.setDocNo(docNo); itx.setTotalQuantity(i.getTotalQuantity());
	 * itx.setTotalWeight(i.getTotalWeight()); itx.setOrgCode(i.getOrgCode());
	 * itx.setSerialNumber(i.getSerialNumber()); invTxnDtls.add(itx); }
	 * inventoryTxnDetailsRepository.saveAll(invTxnDtls);
	 * 
	 * }
	 */
	/*
	 * @Override
	 * 
	 * @Transactional public void addInventoryDtlsTrx(List<InventoryDetailsDaoExt>
	 * inventoryDetails, Short fiscalYear, Integer docNo, DocTypeEnum docType,
	 * InventoryDetailsActionEnum actionType) { List<InventoryTxnDetailsDao>
	 * invTxnDtls = new ArrayList<>(); for (InventoryDetailsDaoExt i :
	 * inventoryDetails) { InventoryTxnDetailsDao itx = new
	 * InventoryTxnDetailsDao(); itx.setBinCode(i.getBinCode());
	 * itx.setFiscalYear(fiscalYear); itx.setItemCode(i.getItemCode());
	 * itx.setItemWeight(i.getStdWeight());
	 * itx.setLocationCode(i.getLocationCode()); itx.setLotNumber(i.getLotNumber());
	 * itx.setActionType(actionType.toString()); itx.setDocType(docType.name());
	 * itx.setDocNo(docNo); itx.setTotalQuantity(i.getTotalQuantity());
	 * itx.setTotalWeight(i.getTotalWeight()); itx.setOrgCode(i.getOrgCode());
	 * itx.setSerialNumber(i.getSerialNumber()); invTxnDtls.add(itx); }
	 * inventoryTxnDetailsRepository.saveAll(invTxnDtls); }
	 */
	@Override
	public List<InventoryDetailsDaoExt> findAllByLocationCodeAndItemCodeAndLotNumberAndSerialNumberAndBinCode(
			String locationCode, String itemCode, String lotNumber, BigDecimal serialNumber, String binCode) {
		return inventoryDetailsRepository.findAllByLocationCodeAndItemCodeAndLotNumberAndStdWeightAndBinCode(
				locationCode, itemCode, lotNumber, serialNumber, binCode);
	}

	@Override
	public List<Object[]> validateDefectiveAndDisputeItems(List<String> inventoryIds) {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return inventoryDetailsRepository.validateDefectiveAndDisputeItems(inventoryIds, authUser.getLocationCode());
	}

	@Override
	public void updateAllItems(BinUpdateBulkDto binUpdateBulkDto, List<InventoryDetailsDaoExt> inventoryDetailLists,
			Integer docNo, DocTypeEnum docType) {
		List<InventoryDetailsDto> inventoryDetailsDto = new ArrayList<>();
		for (InventoryDetailsDaoExt inv : inventoryDetailLists) {
			InventoryDetailsDto invDto = (InventoryDetailsDto) MapperUtil.getDtoMapping(inv, InventoryDetailsDto.class);
			invDto.setDestinationBin(binUpdateBulkDto.getDestBinCode());
			invDto.setDestinationBinGroup(binUpdateBulkDto.getDestBinGroup());
			invDto.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDto.setLastModifiedDate(new Date());
			inventoryDetailsDto.add(invDto);
		}
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(inventoryDetailsDto);
		String s = "IF EXISTS(SELECT * FROM inventory_details WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code= :destinationBin AND  id != :id) "
				+ " BEGIN UPDATE inventory_details SET bin_code = :destinationBin, bin_group_code = :destinationBinGroup,previous_bin_code = bin_code,previous_bin_group_code = bin_group_code,total_weight= (:totalWeight + inventory_details.total_weight),total_value = (:totalValue + inventory_details.total_value),"
				+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate WHERE location_code = :locationCode AND item_code = :itemCode AND lot_number = :lotNumber AND serial_number = :serialNumber AND bin_code = :destinationBin "
				+ " DELETE FROM inventory_details WHERE location_code = :locationCode AND id = :id END "
				+ " ELSE UPDATE inventory_details  SET previous_bin_code = bin_code,previous_bin_group_code = bin_group_code, bin_code = :destinationBin, bin_group_code = :destinationBinGroup, last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate WHERE location_code = :locationCode AND id = :id";

		namedparameterjdbctemplate.batchUpdate(s, batch);

	}

	@Override
	public void updateIssuedQuantity(List<InventoryDetailsDaoExt> invList) {
		inventoryDetailsRepository.saveAll(invList);
	}

	@Override
	public Optional<InventoryDetailsDaoExt> findByItemCodeAndLotNumberAndBinCodeAndBinGroupCode(String itemCode, String lotNumber,
			String binCode, String binGroupCode) {
		return inventoryDetailsRepository.findByItemCodeAndLotNumberAndBinCodeAndBinGroupCode(itemCode, lotNumber, binCode, binGroupCode);
	}

	@Override
	public void updateRequestDetailsForInventoryItems(List<InventoryDetailsDaoExt> detailsList) {
		// TODO Auto-generated method stub
		inventoryDetailsRepository.saveAll(detailsList);
		
	}
}
