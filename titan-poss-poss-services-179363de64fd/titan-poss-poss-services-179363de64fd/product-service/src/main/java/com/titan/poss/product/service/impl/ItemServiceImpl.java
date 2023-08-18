/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.internal.build.AllowSysOut;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import org.slf4j.Logger;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDaoExt;
import com.titan.poss.product.dao.ItemStoneMappingDaoExt;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dao.StuddedSplitDetailsDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.ItemMaterialMappingSyncDtoExt;
import com.titan.poss.product.dto.ItemStoneMappingSyncDtoExt;
import com.titan.poss.product.dto.request.AddItemMaterialMappingDto;
import com.titan.poss.product.dto.request.AddItemStoneMappingDto;
import com.titan.poss.product.dto.request.ItemCreateDto;
import com.titan.poss.product.dto.request.ItemLiteRequestDto;
import com.titan.poss.product.dto.request.ItemMaterialDto;
import com.titan.poss.product.dto.request.ItemStoneDto;
import com.titan.poss.product.dto.request.ItemUpdateDto;
import com.titan.poss.product.dto.response.MaterialCodeDto;
import com.titan.poss.product.dto.response.StoneCodeDto;
import com.titan.poss.product.repository.ItemMaterialMappingRepositoryExt;
import com.titan.poss.product.repository.ItemRepositoryExt;
import com.titan.poss.product.repository.ItemStoneMappingRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.repository.StuddedSplitDetailsRepository;
import com.titan.poss.product.service.ItemService;
import com.titan.poss.product.sync.dto.ItemSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("itemService")
//@CacheDefaults(cacheName = "itemCode")
public class ItemServiceImpl implements ItemService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ItemServiceImpl.class);
	
	private static final String ERR_PRO_002 = "ERR-PRO-002";

	private static final String NO_ITEM_DETAILS_FOUND_FOR_THE_REQUESTED_ITEMCODE = "No Item details found for the requested itemCode";

	private static final String ERR_PRO_020 = "ERR-PRO-020";

	private static final String ITEM_CODE_IS_ALREADY_AVAILABLE = "ItemCode is already available";

	@Autowired
	private ItemRepositoryExt itemDaoRepository;
	
	@Autowired
	private StuddedSplitDetailsRepository studdedSplitDetailsRepository;
	

	@Autowired
	private ItemStoneMappingRepositoryExt itemStoneMappingDaoRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;

	@Autowired
	private ItemMaterialMappingRepositoryExt itemMaterialMappingDaoRepository;

	@Autowired
	private ItemServiceImpl itemService;

	/**
	 * This method will return the list of Item details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ItemDto>>
	 */
	@Override
	// @CacheResult
	public PagedRestResponse<List<ItemDto>> listItem(Boolean isActive, Pageable pageable) {
		Page<ItemDao> itemList = getItemDetails(isActive, pageable);
		List<ItemDto> itemDtoList = new ArrayList<>();
		itemList.forEach(item -> {
			ItemDto itemDto = (ItemDto) MapperUtil.getObjectMapping(item, new ItemDto());
			itemDto.setConfigDetails(MapperUtil.getJsonFromString(item.getConfigDetails()));
			itemDto.setItemDetails(MapperUtil.getJsonFromString(item.getItemDetails()));
			itemDtoList.add(getItemDepends(item, itemDto));
		});
		return (new PagedRestResponse<>(itemDtoList, itemList));
	}

	private Page<ItemDao> getItemDetails(Boolean isActive, Pageable pageable) {
		ItemDao itemCriteria = new ItemDao();
		itemCriteria.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ItemDao> criteria = Example.of(itemCriteria, matcher);
		return itemDaoRepository.findAll(criteria, pageable);
	}

	/**
	 * This method will return the Item details based on the itemCode.
	 * 
	 * @param itemCode
	 * @return ItemDto
	 */
	@Override
	// @CacheResult
	public ItemDto getItem(String itemCode) {
		ItemDao item = itemDaoRepository.findOneByItemCode(itemCode);
		if (item == null) {
			throw new ServiceException(NO_ITEM_DETAILS_FOUND_FOR_THE_REQUESTED_ITEMCODE, ERR_PRO_002);
		}
		ItemDto itemDto = (ItemDto) MapperUtil.getObjectMapping(item, new ItemDto());
		itemDto.setConfigDetails(MapperUtil.getJsonFromString(item.getConfigDetails()));
		itemDto.setItemDetails(MapperUtil.getJsonFromString(item.getItemDetails()));
		return getItemDepends(item, itemDto);
	}

	/**
	 * This method will add the Item depends to the ItemDto from the Item and
	 * returns ItemDto.
	 * 
	 * @param item
	 * @param itemDto
	 * @return ItemDto
	 */
	private ItemDto getItemDepends(ItemDao item, ItemDto itemDto) {
		try {
			itemDto.setComplexityCode(item.getComplexity().getComplexityCode());
		} catch (NullPointerException e) {
			itemDto.setComplexityCode("");
		}

		try {
			itemDto.setProductGroupCode(item.getProductGroup().getProductGroupCode());
		} catch (NullPointerException e) {
			itemDto.setProductGroupCode("");
		}

		try {
			itemDto.setProductCategoryCode(item.getProductCategory().getProductCategoryCode());
		} catch (NullPointerException e) {
			itemDto.setProductCategoryCode("");
		}

		try {
			itemDto.setBrandCode(item.getBrandCode());
		} catch (NullPointerException e) {
			itemDto.setBrandCode("");
		}

		try {
			itemDto.setItemTypeCode(item.getItemType().getItemTypeCode());
		} catch (NullPointerException e) {
			itemDto.setItemTypeCode("");
		}

		try {
			itemDto.setParentItemCode(item.getParentItem().getItemCode());
		} catch (NullPointerException e) {
			itemDto.setParentItemCode("");
		}

		try {
			itemDto.setOrgCode(item.getOrgCode());
		} catch (NullPointerException e) {
			itemDto.setOrgCode("");
		}

		return itemDto;
	}

	/**
	 * This method will save the Item details.
	 * 
	 * @param itemCreateDto
	 * @return ItemDto
	 */
	@Override
	public ItemDto addItem(ItemCreateDto itemCreateDto) {

		ItemDao item = itemDaoRepository.findOneByItemCode(itemCreateDto.getItemCode());

		if (item != null) {
			throw new ServiceException(ITEM_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_020);
		}

		item = (ItemDao) MapperUtil.getObjectMapping(itemCreateDto, new ItemDao());
		item.setConfigDetails(MapperUtil.getStringFromJson(itemCreateDto.getConfigDetails()));
		item.setItemDetails(MapperUtil.getStringFromJson(itemCreateDto.getItemDetails()));
		item.setIsEditable(true);
		item.setSrcSyncId(0);
		item.setDestSyncId(0);

		SyncStagingDto data = itemService.saveItemToDB(item, itemCreateDto, ProductOperationCodes.ITEM_ADD);
		syncDataService.publishProductMessagesToQueue(data);
		ItemDto itemDto = (ItemDto) MapperUtil.getObjectMapping(item, new ItemDto());
		return getItemDepends(item, itemDto);

	}

	/**
	 * This method will add the Item depends to the Item from the ItemDto and
	 * returns Item.
	 * 
	 * @param item
	 * @param itemCreateDto
	 * @return Item
	 */
	private ItemDao addItemDepends(ItemDao item, ItemCreateDto itemCreateDto) {

		String complexityCode = itemCreateDto.getComplexityCode();
		setComplexityCode(item, complexityCode);

		String productGroupCode = itemCreateDto.getProductGroupCode();
		setProductGroupCode(item, productGroupCode);

		String productCategoryCode = itemCreateDto.getProductCategoryCode();
		setProductCategoryCode(item, productCategoryCode);

		String brandCode = itemCreateDto.getBrandCode();
		setBrandCode(item, brandCode);

		String itemTypeCode = itemCreateDto.getItemTypeCode();
		setItemTypeCode(item, itemTypeCode);

		String parentItemCode = itemCreateDto.getParentItemCode();
		setParentItemCode(item, parentItemCode);

		String orgCode = itemCreateDto.getOrgCode();
		setOrgCode(item, orgCode);
		return item;
	}

	private void setOrgCode(ItemDao item, String orgCode) {
		if (orgCode != null && orgCode.length() > 0) {
			item.setOrgCode(orgCode);
		} else {
			if (orgCode != null && orgCode.length() == 0) {
				item.setOrgCode(null);
			}
		}
	}

	private void setParentItemCode(ItemDao item, String parentItemCode) {
		if (parentItemCode != null && parentItemCode.length() > 0) {
			ItemDao parentItem = new ItemDao();
			parentItem.setItemCode(parentItemCode);
			item.setParentItem(parentItem);
		} else {
			if (parentItemCode != null && parentItemCode.length() == 0) {
				item.setParentItem(null);
			}
		}
	}

	private void setItemTypeCode(ItemDao item, String itemTypeCode) {
		if (itemTypeCode != null && itemTypeCode.length() > 0) {
			ItemTypeDao itemType = new ItemTypeDao();
			itemType.setItemTypeCode(itemTypeCode);
			item.setItemType(itemType);
		} else {
			if (itemTypeCode != null && itemTypeCode.length() == 0) {
				item.setItemType(null);
			}
		}
	}

	private void setBrandCode(ItemDao item, String brandCode) {
		if (brandCode != null && brandCode.length() > 0) {
			item.setBrandCode(brandCode);
		} else {
			if (brandCode != null && brandCode.length() == 0) {
				item.setBrandCode(null);
			}
		}

	}

	private void setProductCategoryCode(ItemDao item, String productCategoryCode) {
		if (productCategoryCode != null && productCategoryCode.length() > 0) {
			ProductCategoryDao productCategory = new ProductCategoryDao();
			productCategory.setProductCategoryCode(productCategoryCode);
			item.setProductCategory(productCategory);
		} else {
			if (productCategoryCode != null && productCategoryCode.length() == 0) {
				item.setProductCategory(null);
			}
		}

	}

	private void setProductGroupCode(ItemDao item, String productGroupCode) {
		if (productGroupCode != null && productGroupCode.length() > 0) {
			ProductGroupDao productGroup = new ProductGroupDao();
			productGroup.setProductGroupCode(productGroupCode);
			item.setProductGroup(productGroup);
		} else {
			if (productGroupCode != null && productGroupCode.length() == 0) {
				item.setProductGroup(null);
			}
		}
	}

	private void setComplexityCode(ItemDao item, String complexityCode) {
		if (complexityCode != null && complexityCode.length() > 0) {
			ComplexityDao complexity = new ComplexityDao();
			complexity.setComplexityCode(complexityCode);
			item.setComplexity(complexity);
		} else {
			if (complexityCode != null && complexityCode.length() == 0) {
				item.setComplexity(null);
			}
		}

	}

	/**
	 * This method will update the Item details.
	 * 
	 * @param itemCode
	 * @param itemUpdateDto
	 * @return ItemDto
	 */
	@Override
	public ItemDto updateItem(String itemCode, ItemUpdateDto itemUpdateDto) {
		ItemDao item = itemDaoRepository.findOneByItemCode(itemCode);
		if (item == null) {
			throw new ServiceException(NO_ITEM_DETAILS_FOUND_FOR_THE_REQUESTED_ITEMCODE, ERR_PRO_002);
		}
		String configDetails = item.getConfigDetails();
		String itemDetails = item.getItemDetails();
		Object configDetailsPatch = itemUpdateDto.getConfigDetails();
		Object itemDetailsPatch = itemUpdateDto.getItemDetails();
		if (configDetailsPatch != null) {
			configDetails = MapperUtil.mergeJsonObjects(configDetailsPatch,
					MapperUtil.getJsonFromString(configDetails));
		}
		if (itemDetailsPatch != null) {
			itemDetails = MapperUtil.mergeJsonObjects(itemDetailsPatch, MapperUtil.getJsonFromString(itemDetails));
		}
		item = (ItemDao) MapperUtil.getObjectMapping(itemUpdateDto, item);
		item.setConfigDetails(configDetails);
		item.setItemDetails(itemDetails);
		ItemCreateDto itemCreateDto = (ItemCreateDto) MapperUtil.getObjectMapping(itemUpdateDto, new ItemCreateDto());
		item.setSrcSyncId(item.getSrcSyncId() + 1);

		SyncStagingDto data = itemService.saveItemToDB(item, itemCreateDto, ProductOperationCodes.ITEM_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		ItemDto itemDto = (ItemDto) MapperUtil.getObjectMapping(item, new ItemDto());
		itemDto.setConfigDetails(MapperUtil.getJsonFromString(item.getConfigDetails()));
		itemDto.setItemDetails(MapperUtil.getJsonFromString(item.getItemDetails()));
		itemDto.setItemTypeCode(item.getItemType().getItemTypeCode());
		return getItemDepends(item, itemDto);
	}

	@Override
	public ConversionItemDto listItems(String itemCode, String lotNumber) {
		
		List<Object[]> itemList = itemDaoRepository.listItems(itemCode, true, lotNumber);   //as lot_stone_details have lots with 'PS' for studded split childs

		ConversionItemDto convItem = new ConversionItemDto();
		for (Object[] object : itemList) {
			// call convertObjectToDto() to get the mapped dto
			convItem.setItemCode((String) object[0]);
			convItem.setProductCategoryCode((String) object[1]);
			convItem.setProductGroupCode((String) object[2]);
			convItem.setItemDescription((String) object[3]);
			convItem.setComplexityCode((String) object[4]);
			convItem.setStdWeight((BigDecimal) object[5]);
			convItem.setStdValue((BigDecimal) object[6]);
			convItem.setLotNumber((String) object[7]);
			convItem.setParentItemCode((String) object[8]);
			convItem.setPricingGroupType((String) object[9]);
			convItem.setStoneValue((BigDecimal) object[10]);

		}

		// get the child items against the parent item
		if (convItem.getLotNumber() != null)
			getChildItems(itemCode, convItem, lotNumber);

		return convItem;
	}

	private void convertObjectToDto(String parentItemCode,ConversionItemDto convItem, Object[] object, boolean isUpdateRequired) {
 		convItem.setItemCode((String) object[0]);
		convItem.setProductCategoryCode((String) object[1]);
		convItem.setProductGroupCode((String) object[2]);
		convItem.setItemDescription((String) object[3]);
		convItem.setComplexityCode((String) object[4]);
		convItem.setStdWeight((BigDecimal) object[5]);
		convItem.setStdValue((BigDecimal) object[6]);
		
		if (object.length > 7)
			convItem.setLotNumber((String) object[7]);
		if (object.length > 8 && object[8]!=null)
			convItem.setParentItemCode((String) object[8]);
		if (object.length > 9)
			convItem.setStoneWeight((BigDecimal) object[9]);
		if (object.length > 10)
			convItem.setStoneValue((BigDecimal) object[10]);
		if (object.length > 11)
			convItem.setSold((Boolean) object[11]);
		if (object.length > 12)
			convItem.setPricingGroupType((String) object[12]);
		if (isUpdateRequired) {
			StuddedSplitDetailsDao studdedSplitDtl=new StuddedSplitDetailsDao();
			String itemChild=(String)object[0];
			LOGGER.info("locationCode-------"+CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			studdedSplitDtl = studdedSplitDetailsRepository.findDetailAndItemCode("CDTL",
					itemChild,parentItemCode,CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			
			System.out.println("Check"+studdedSplitDtl);
			
			if (studdedSplitDtl != null) {
				convItem.setStdWeight(studdedSplitDtl.getWeight());
				convItem.setStdValue(studdedSplitDtl.getValue());
				convItem.setStoneWeight(studdedSplitDtl.getOtherStoneWeight().add(studdedSplitDtl.getDiamondWeight()));
				convItem.setStoneValue(studdedSplitDtl.getActualF1());
			}
		}
	}

	private void convertObjectToPlainDto(String parentItemCode,ConversionItemDto convItem, Object[] object, boolean isUpdateRequired) {
 		convItem.setItemCode((String) object[0]);
		convItem.setProductCategoryCode((String) object[1]);
		convItem.setProductGroupCode((String) object[2]);
		convItem.setItemDescription((String) object[3]);
		convItem.setComplexityCode((String) object[4]);
		convItem.setStdWeight((BigDecimal) object[5]);
		convItem.setStdValue((BigDecimal) object[6]);
		
		if (object.length > 7)
			convItem.setSold((Boolean) object[7]);
		if (object.length > 9)
			convItem.setStoneWeight((BigDecimal) object[9]);
		if (object.length > 10)
		convItem.setStoneValue((BigDecimal) object[10]);
		if (object.length > 11)
			convItem.setSold((Boolean) object[11]);
		if (object.length > 12)
			convItem.setStoneValue((BigDecimal) object[12]);
		if (isUpdateRequired) {
			StuddedSplitDetailsDao studdedSplitDtl=new StuddedSplitDetailsDao();
			String itemChild=(String)object[0];
			LOGGER.info("locationCode-------"+CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			studdedSplitDtl = studdedSplitDetailsRepository.findDetailAndItemCode("CDTL",
					itemChild,parentItemCode,CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			
			System.out.println("Check"+studdedSplitDtl.toString());
			
			if (studdedSplitDtl != null) {
				convItem.setStdWeight(studdedSplitDtl.getWeight());
				convItem.setStdValue(studdedSplitDtl.getValue());
				convItem.setStoneWeight(studdedSplitDtl.getOtherStoneWeight());
				convItem.setStoneValue(studdedSplitDtl.getActualF1());
			}
		}
	}
	
	private List<ConversionItemDto> getChildItems(String itemCode, ConversionItemDto convItem, String parentLotNumber) {
		List<ConversionItemDto> convItemList = new ArrayList<>();

		// if lotNumber(input value) & item's lotNumber don't match then throw exception
		if (!convItem.getLotNumber().equalsIgnoreCase(parentLotNumber)) {
			throw new ServiceException("Item against the lotnumber is mismatched", "ERR-PRO-013");
		}
		List<Object[]> childItems = itemDaoRepository.listChildItems(itemCode, true, parentLotNumber+"_PS");
		for (Object[] item : childItems) {
			ConversionItemDto itemDto = new ConversionItemDto();
			// call convertObjectToDto() to get the mapped dto
			convertObjectToDto(itemCode,itemDto, item,true);
			itemDto.setStudded(true);
			convItemList.add(itemDto);
		}
		convItem.setChildItems(convItemList);
		return convItemList;

	}

	@Override
	public ItemStoneDto itemStoneMapping(String itemCode, ItemStoneDto itemStoneDto) {
		if (!itemDaoRepository.findById(itemCode).isPresent())
			throw new ServiceException(NO_ITEM_DETAILS_FOUND_FOR_THE_REQUESTED_ITEMCODE, "ERR-PRO-028");

		List<ItemStoneMappingDaoExt> itemStoneMappingList = new ArrayList<>();
		List<StoneDao> stoneList = new ArrayList<>();
		ItemDao item = new ItemDao();
		item.setItemCode(itemCode);

		if (itemStoneDto.getRemoveStones() != null && !itemStoneDto.getRemoveStones().isEmpty()) {
			itemStoneDto.getRemoveStones().forEach(removeStone -> {
				StoneDao stone = new StoneDao();
				stone.setStoneCode(removeStone);
				stoneList.add(stone);
			});
			List<ItemStoneMappingDaoExt> removeMapping = itemStoneMappingDaoRepository.getItemStoneMapping(item,
					stoneList);
			removeMapping.forEach(removeMappingDao -> {
				removeMappingDao.setIsActive(false);
				// add sync time
				removeMappingDao.setSyncTime(new Date().getTime());
				itemStoneMappingList.add(removeMappingDao);
			});
		}

		if (itemStoneDto.getAddStones() != null && !itemStoneDto.getAddStones().isEmpty()) {
			stoneList.clear();
			itemStoneDto.getAddStones().forEach(addStone -> {
				StoneDao stone = new StoneDao();
				stone.setStoneCode(addStone.getStoneCode());
				stoneList.add(stone);
			});
			List<ItemStoneMappingDaoExt> getMapping = itemStoneMappingDaoRepository.getItemStoneMapping(item,
					stoneList);
			Set<AddItemStoneMappingDto> mapStones = itemStoneDto.getAddStones();
			Map<String, ItemStoneMappingDaoExt> itemStoneMappingMap = new HashMap<>();
			for (ItemStoneMappingDaoExt itemStoneMappingDao : getMapping)
				itemStoneMappingMap.put(itemStoneMappingDao.getStone().getStoneCode(), itemStoneMappingDao);
			mapStones.forEach(mappingStones -> {
				ItemStoneMappingDaoExt itemStoneMapping = new ItemStoneMappingDaoExt();

				if (!itemStoneMappingMap.isEmpty() && itemStoneMappingMap.containsKey(mappingStones.getStoneCode())) {
					itemStoneMapping = (ItemStoneMappingDaoExt) MapperUtil.getObjectMapping(mappingStones,
							itemStoneMappingMap.get(mappingStones.getStoneCode()));
				} else {
					itemStoneMapping = (ItemStoneMappingDaoExt) MapperUtil.getObjectMapping(mappingStones,
							new ItemStoneMappingDaoExt());
				}
				// add sync time
				itemStoneMapping.setSyncTime(new Date().getTime());
				StoneDao stone = new StoneDao();
				stone.setStoneCode(mappingStones.getStoneCode());
				itemStoneMapping.setItem(item);
				itemStoneMapping.setStone(stone);
				itemStoneMappingList.add(itemStoneMapping);

			});

		}
		if (!itemStoneMappingList.isEmpty()) {
			SyncStagingDto data = itemService.saveItemStoneMappingToDB(itemStoneMappingList,
					ProductOperationCodes.ITEM_STONE_MAPPING_ADD);
			syncDataService.publishProductMessagesToQueue(data);
		}
		return itemStoneDto;
	}

	@Override
	public ListResponse<StoneCodeDto> listItemStoneMapping(String itemCode, Boolean isActive) {
		List<ItemStoneMappingDaoExt> itemList = getItemStoneDetails(itemCode, isActive);
		if (CollectionUtils.isEmpty(itemList)) {
			throw new ServiceException("No stone mapping found for requested itemCode", "ERR-PRO-027");
		}
		List<StoneCodeDto> itemStoneMappingDtoList = new ArrayList<>();
		itemList.forEach(items -> {
			StoneCodeDto stoneCode = (StoneCodeDto) MapperUtil.getObjectMapping(items, new StoneCodeDto());
			stoneCode.setItemCode(items.getItem().getItemCode());
			stoneCode.setStoneCode(items.getStone().getStoneCode());
			itemStoneMappingDtoList.add(stoneCode);
		});
		return new ListResponse<>(itemStoneMappingDtoList);
	}

	private List<ItemStoneMappingDaoExt> getItemStoneDetails(String itemCode, Boolean isActive) {
		ItemDao item = new ItemDao();
		item.setItemCode(itemCode);
		ItemStoneMappingDaoExt itemStoneMapping = new ItemStoneMappingDaoExt();
		itemStoneMapping.setItem(item);
		itemStoneMapping.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ItemStoneMappingDaoExt> criteria = Example.of(itemStoneMapping, matcher);

		return itemStoneMappingDaoRepository.findAll(criteria);
	}

	/**
	 * @param ItemCreateDto
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveItemToDB(ItemDao item, ItemCreateDto itemCreateDto, String operation) {

		
		ItemDao itemDao = itemDaoRepository.save(addItemDepends(item, itemCreateDto));
		// converting to required json string
		List<SyncData> itemSyncData = new ArrayList<>();
		ItemSyncDto itemSyncDto = new ItemSyncDto(itemDao);
		itemSyncData.add(DataSyncUtil.createSyncData(itemSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest itemMsgeRequest = DataSyncUtil.createMessageRequest(itemSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(itemMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(itemMsgeRequest);
		// saving to staging table
		SyncStaging itemStaggingMsg = new SyncStaging();
		itemStaggingMsg.setMessage(requestBody);
		itemStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		itemStaggingMsg = productSyncStagingRepository.save(itemStaggingMsg);
		syncStagingDto.setId(itemStaggingMsg.getId());
		return syncStagingDto;
	}

	/**
	 * @param itemStoneMappingList
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveItemStoneMappingToDB(List<ItemStoneMappingDaoExt> itemStoneMappingList,
			String operation) {
		List<ItemStoneMappingDaoExt> savedMapping = itemStoneMappingDaoRepository.saveAll(itemStoneMappingList);
		// converting to required json string
		List<SyncData> itemStoneSyncData = new ArrayList<>();
		ItemStoneMappingSyncDtoExt syncDtoExt = new ItemStoneMappingSyncDtoExt();
		itemStoneSyncData.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(savedMapping), 1));
		List<String> destinations = new ArrayList<>();
		MessageRequest itemStoneMsgRequest = DataSyncUtil.createMessageRequest(itemStoneSyncData, operation,
				destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(itemStoneMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(itemStoneMsgRequest);
		// saving to staging table
		SyncStaging itemStoneStaggingMsg = new SyncStaging();
		itemStoneStaggingMsg.setMessage(requestBody);
		itemStoneStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		itemStoneStaggingMsg = productSyncStagingRepository.save(itemStoneStaggingMsg);
		syncStagingDto.setId(itemStoneStaggingMsg.getId());
		return syncStagingDto;
	}

	/**
	 * This method will return the list of Item material mapping details based on
	 * isActive
	 * 
	 * @param itemCode
	 * @param isActive
	 * @return List<MaterialCodeDto>
	 */
	

	@Override
	public ListResponse<MaterialCodeDto> listItemMaterialMapping(String itemCode, Boolean isActive) {
		List<ItemMaterialMappingDaoExt> itemList = getItemMaterialDetails(itemCode, isActive);
		if (CollectionUtils.isEmpty(itemList)) {
			throw new ServiceException("No stone mapping found for requested itemCode", "ERR-PRO-027");
		}
		List<MaterialCodeDto> itemMaterialeMappingDtoList = new ArrayList<>();
		itemList.forEach(items -> {
			MaterialCodeDto materialCodeDto = (MaterialCodeDto) MapperUtil.getObjectMapping(items,
					new MaterialCodeDto());
			materialCodeDto.setItemCode(items.getItem().getItemCode());
			materialCodeDto.setMaterialCode(items.getMaterial());
			itemMaterialeMappingDtoList.add(materialCodeDto);

	});
		
		return new ListResponse<>(itemMaterialeMappingDtoList);
	}

	private List<ItemMaterialMappingDaoExt> getItemMaterialDetails(String itemCode, Boolean isActive) {
		ItemDao item = new ItemDao();
		item.setItemCode(itemCode);
		ItemMaterialMappingDaoExt itemMaterialMapping = new ItemMaterialMappingDaoExt();
		itemMaterialMapping.setItem(item);
		itemMaterialMapping.setIsActive(isActive);
		
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ItemMaterialMappingDaoExt> criteria = Example.of(itemMaterialMapping, matcher);

		return itemMaterialMappingDaoRepository.findAll(criteria);
	}

	/**
	 * This method will create/remove mapping between item and material.
	 * 
	 * @param itemCode
	 * @param itemMaterialDto
	 * @return ItemMaterialDto
	 */
	@Override
	public ItemMaterialDto itemMaterialMapping(String itemCode, ItemMaterialDto itemMaterialDto) {
		if (!itemDaoRepository.findById(itemCode).isPresent())
			throw new ServiceException(NO_ITEM_DETAILS_FOUND_FOR_THE_REQUESTED_ITEMCODE, "ERR-PRO-028");

		List<ItemMaterialMappingDaoExt> itemMaterialMappingList = new ArrayList<>();
		List<String> materialCode = new ArrayList<>();
		ItemDao item = new ItemDao();
		item.setItemCode(itemCode);
		if(itemMaterialDto.getRemoveMaterials()!=null && !itemMaterialDto.getRemoveMaterials().isEmpty()) {
			itemMaterialDto.getRemoveMaterials().forEach(removeMaterial -> {
				materialCode.add(removeMaterial);
			});
			List<ItemMaterialMappingDaoExt> removeMapping = itemMaterialMappingDaoRepository
					.getItemMaterialMapping(item, materialCode);
			removeMapping.forEach(removeMappingDao -> {
				removeMappingDao.setIsActive(false);
				// add sync time
				removeMappingDao.setSyncTime(new Date().getTime());
				itemMaterialMappingList.add(removeMappingDao);
			});
		}
		if (itemMaterialDto.getAddMaterials() != null && !itemMaterialDto.getAddMaterials().isEmpty()) {
			//materialList.clear();
			materialCode.clear();
			itemMaterialDto.getAddMaterials().forEach(addMaterial -> {
//				MaterialDao material = new MaterialDao();
//				material.setMaterialCode(addMaterial.getMaterialCode());
//				materialList.add(material);
				materialCode.add(addMaterial.getMaterialCode());
			});
//			List<ItemMaterialMappingDaoExt> getMapping = itemMaterialMappingDaoRepository.getItemMaterialMapping(item,
//					materialList);
			List<ItemMaterialMappingDaoExt> getMapping = itemMaterialMappingDaoRepository.getItemMaterialMapping(item,
					materialCode);
			Set<AddItemMaterialMappingDto> mapMaterial = itemMaterialDto.getAddMaterials();
			Map<String, ItemMaterialMappingDaoExt> itemMaterialMappingMap = new HashMap<>();
			for (ItemMaterialMappingDaoExt itemMaterialMappingDao : getMapping)
				itemMaterialMappingMap.put(itemMaterialMappingDao.getMaterial(),
						itemMaterialMappingDao);
			mapMaterial.forEach(mappingMaterials -> {
				ItemMaterialMappingDaoExt itemMaterialMapping = new ItemMaterialMappingDaoExt();

				if (!itemMaterialMappingMap.isEmpty()
						&& itemMaterialMappingMap.containsKey(mappingMaterials.getMaterialCode())) {
					itemMaterialMapping = (ItemMaterialMappingDaoExt) MapperUtil.getObjectMapping(mappingMaterials,
							itemMaterialMappingMap.get(mappingMaterials.getMaterialCode()));
				} else {
					itemMaterialMapping = (ItemMaterialMappingDaoExt) MapperUtil.getObjectMapping(mappingMaterials,
							new ItemMaterialMappingDaoExt());
				}
				// add sync time
				itemMaterialMapping.setSyncTime(new Date().getTime());
//				MaterialDao material = new MaterialDao();
//				material.setMaterialCode(mappingMaterials.getMaterialCode());
				itemMaterialMapping.setItem(item);
				itemMaterialMapping.setMaterial(mappingMaterials.getMaterialCode());
				itemMaterialMappingList.add(itemMaterialMapping);

			});

		}
		if (!itemMaterialMappingList.isEmpty()) {
			SyncStagingDto data = itemService.saveItemMaterialMappingToDB(itemMaterialMappingList,
					ProductOperationCodes.ITEM_MATERIAL_MAPPING_ADD);
			syncDataService.publishProductMessagesToQueue(data);
		}
		return itemMaterialDto;
	}

	/**
	 * @param itemMaterialMappingList
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveItemMaterialMappingToDB(List<ItemMaterialMappingDaoExt> itemMaterialMappingList,
			String operation) {
		List<ItemMaterialMappingDaoExt> savedMapping = itemMaterialMappingDaoRepository
				.saveAll(itemMaterialMappingList);
		List<SyncData> syncDataList = new ArrayList<>();
		ItemMaterialMappingSyncDtoExt syncDtoExt = new ItemMaterialMappingSyncDtoExt();
		syncDataList.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(savedMapping), 1));
		List<String> destinations = new ArrayList<>();
		MessageRequest itemMaterialMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(itemMaterialMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(itemMaterialMsgRequest);
		SyncStaging itemMaterialStagging = new SyncStaging();
		itemMaterialStagging.setMessage(requestBody);
		itemMaterialStagging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		itemMaterialStagging = productSyncStagingRepository.save(itemMaterialStagging);
		syncStagingDto.setId(itemMaterialStagging.getId());
		return syncStagingDto;
	}

	@Transactional
	@Override
	public ListResponse<ItemLiteDto> getItemLiteDetails(ItemLiteRequestDto itemLiteDto) {
		Set<String> includeProductGroups = CollectionUtil.setNullIfEmpty(itemLiteDto.getIncludeProductGroups());
		Set<String> excludeProductGroups = CollectionUtil.setNullIfEmpty(itemLiteDto.getExcludeProductGroups());
		Set<String> includeProductCategories = CollectionUtil.setNullIfEmpty(itemLiteDto.getIncludeProductCategories());
		Set<String> excludeProductCategories = CollectionUtil.setNullIfEmpty(itemLiteDto.getExcludeProductCategories());

		List<ItemDao> itemDetails = itemDaoRepository.listItemDetails(includeProductGroups, excludeProductGroups,
				includeProductCategories, excludeProductCategories, itemLiteDto.getIsFocItem());
		List<ItemLiteDto> itemList = new ArrayList<>();
		itemDetails.forEach(itemDetail -> {
			ItemLiteDto itemDto = (ItemLiteDto) MapperUtil.getDtoMapping(itemDetail, ItemLiteDto.class);
			itemDto.setItemTypeCode(itemDetail.getItemType().getItemTypeCode());
			itemDto.setProductGroupCode(itemDetail.getProductGroup().getProductGroupCode());
			itemDto.setProductGroupDesc(itemDetail.getProductGroup().getDescription());
			itemDto.setProductCategoryCode(itemDetail.getProductCategory().getProductCategoryCode());
			itemDto.setProductCategoryDesc(itemDetail.getProductCategory().getDescription());
			itemList.add(itemDto);
		});

		return new ListResponse<>(itemList);
	}

	@Override
	public ItemDao getItemDao(String itemCode) {
		return itemDaoRepository.findOneByItemCode(itemCode);
	}

	@Override
	public ConversionItemDto getItemMasterForConversion(String itemCode) {
		List<Object[]> itemList = itemDaoRepository.listItemsForConversion(itemCode, true);

		ConversionItemDto convItem = new ConversionItemDto();
		for (Object[] object : itemList) {
			// call convertObjectToDto() to get the mapped dto
			convItem.setItemCode((String) object[0]);
			convItem.setProductCategoryCode((String) object[1]);
			convItem.setProductGroupCode((String) object[2]);
			convItem.setItemDescription((String) object[3]);
			convItem.setComplexityCode((String) object[4]);
			convItem.setStdWeight((BigDecimal) object[5]);
			convItem.setStdValue((BigDecimal) object[6]);
			convItem.setPricingGroupType((String) object[7]);
			convItem.setStoneValue((BigDecimal) object[8]);
		}
		List<ConversionItemDto> convItemList = new ArrayList<>();

		List<Object[]> childItems = itemDaoRepository.listChildItemsForConversion(itemCode, true);
		for (Object[] object : childItems) {
			ConversionItemDto itemDto = new ConversionItemDto();

			// call convertObjectToDto() to get the mapped dto
			itemDto.setItemCode((String) object[0]);
			itemDto.setProductCategoryCode((String) object[1]);
			itemDto.setProductGroupCode((String) object[2]);
			itemDto.setItemDescription((String) object[3]);
			itemDto.setComplexityCode((String) object[4]);
			itemDto.setStdWeight((BigDecimal) object[5]);
			itemDto.setStdValue((BigDecimal) object[6]);
			itemDto.setSold((Boolean) object[7]);
			itemDto.setStoneValue((BigDecimal) object[8]);
			itemDto.setPricingGroupType((String) object[9]);
			convItemList.add(itemDto);
		}
		convItem.setChildItems(convItemList);
		return convItem;

	}

}
