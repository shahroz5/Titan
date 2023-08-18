/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dto.request.ProductGroupUpdateDto;
import com.titan.poss.product.dto.request.json.ProductGroupConfig;
import com.titan.poss.product.dto.request.json.ProductGroupPricing;
import com.titan.poss.product.repository.ProductGroupRepositoryExt;
import com.titan.poss.product.service.ProductGroupService;
import com.titan.poss.product.sync.dto.ProductGroupSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("productGroupService")
public class ProductGroupServiceImpl implements ProductGroupService {

	private static final String ERR_PRO_004 = "ERR-PRO-004";

	private static final String ERR_PRO_014 = "ERR-PRO-014";

	private static final String NO_PRODUCTGROUP_DETAILS_FOUND_FOR_THE_REQUESTED_PRODUCTGROUPCODE = "No ProductGroup details found for the requested productGroupCode";

	private static final String PRODUCT_GROUP_CODE_IS_ALREADY_AVAILABLE = "ProductGroupCode is already available";

	private static final String JSON_TYPE_MISMATCH = "JSON type mismatch";
	private static final String ERR_CORE_14 = "ERR-CORE-014";

	@Value("${productGroupCache}")
	private String productGroupCache;

	@Autowired
	private ProductGroupRepositoryExt productGroupRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductGroupServiceImpl productGroupService;

	@Autowired
	private EngineServiceClient engineServiceClient;

	/**
	 * This method will return the list of ProductGroup details based on the
	 * isActive.
	 * 
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ProductGroupDto>>
	 */
	@Override
	public PagedRestResponse<List<ProductGroupDto>> listProductGroup(Boolean isActive, String productGroupCode,
			String pricingType, Boolean isConversionAllowed, Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		Page<ProductGroupDao> productGroupList = productGroupRepository.findAllProductGroups(isActive, productGroupCode,
				pricingType, isConversionAllowed, pageable);
		List<ProductGroupDto> productGroupDtoList = new ArrayList<>();
		productGroupList.forEach(productGroup -> {
			ProductGroupDto productGroupDto = (ProductGroupDto) MapperUtil.getObjectMapping(productGroup,
					new ProductGroupDto());
			setConfigAndPricingDetailsJson(productGroup, productGroupDto);
			productGroupDtoList.add(getProductGroupDepends(productGroup, productGroupDto));
		});
		return (new PagedRestResponse<>(productGroupDtoList, productGroupList));
	}

	/**
	 * This method will return the ProductGroup details based on the
	 * productGroupCode.
	 * 
	 * @param productGroupCode
	 * @return ProductGroupDto
	 */
	@Override
	public ProductGroupDto getProductGroup(String productGroupCode) {
		ProductGroupDao productGroup = productGroupRepository.findOneByProductGroupCode(productGroupCode);
		if (productGroup == null) {
			throw new ServiceException(NO_PRODUCTGROUP_DETAILS_FOUND_FOR_THE_REQUESTED_PRODUCTGROUPCODE, ERR_PRO_004);
		}
		ProductGroupDto productGroupDto = (ProductGroupDto) MapperUtil.getObjectMapping(productGroup,
				new ProductGroupDto());
		setConfigAndPricingDetailsJson(productGroup, productGroupDto);
		return getProductGroupDepends(productGroup, productGroupDto);
	}

	private void setConfigAndPricingDetailsJson(ProductGroupDao productGroup, ProductGroupDto productGroupDto) {
		JsonData configDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(productGroup.getConfigDetails()), JsonData.class);
		productGroupDto.setConfigDetails(configDetails);
		JsonData pricingDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(productGroup.getPricingDetails()), JsonData.class);
		productGroupDto.setPricingDetails(pricingDetails);
	}

	/**
	 * This method will add the ProductGroup depends to the ProductGroupDto from the
	 * ProductGroup and returns ProductGroupDto.
	 * 
	 * @param productGroup
	 * @param productGroupDto
	 * @return ProductGroupDto
	 */
	private ProductGroupDto getProductGroupDepends(ProductGroupDao productGroup, ProductGroupDto productGroupDto) {
		try {
			productGroupDto.setItemTypeCode(productGroup.getItemType().getItemTypeCode());
		} catch (NullPointerException e) {
			productGroupDto.setItemTypeCode("");
		}
		try {
			productGroupDto.setOrgCode(productGroup.getOrgCode());
		} catch (NullPointerException e) {
			productGroupDto.setOrgCode("");
		}
		return productGroupDto;
	}

	/**
	 * This method will save the ProductGroup details.
	 * 
	 * @param productGroupDto
	 * @return ProductGroupDto
	 */
	@Override
	public ProductGroupDto addProductGroup(ProductGroupDto productGroupDto) {
		productGroupJsonValidation(productGroupDto.getConfigDetails(), productGroupDto.getPricingDetails());
		ProductGroupDao productGroup = productGroupRepository
				.findOneByProductGroupCode(productGroupDto.getProductGroupCode());
		if (productGroup != null) {
			throw new ServiceException(PRODUCT_GROUP_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_014);
		}
		productGroup = (ProductGroupDao) MapperUtil.getDtoMapping(productGroupDto, ProductGroupDao.class);
		productGroup.setConfigDetails(MapperUtil.getStringFromJson(productGroupDto.getConfigDetails()));
		productGroup.setPricingDetails(MapperUtil.getStringFromJson(productGroupDto.getPricingDetails()));
		productGroup.setSrcSyncId(0);
		productGroup.setDestSyncId(0);
		Map<String, SyncStagingDto> data = productGroupService.saveProductGroupToDB(productGroup, productGroupDto,
				ProductOperationCodes.PRODUCT_GROUP_ADD, true);
		syncDataService.publishProductMessages(data);
		return productGroupDto;

	}

	private void productGroupJsonValidation(JsonData configDetails, JsonData pricingDetails) {
		if (configDetails != null) {
			if (!"PRODUCT_GROUP_CONFIG".equals(configDetails.getType())) {
				throw new ServiceException(JSON_TYPE_MISMATCH, ERR_CORE_14);
			}
			ProductGroupConfig productGroupJson = new ProductGroupConfig();
			productGroupJson.validate(configDetails.getData());
		}
		if (pricingDetails != null) {
			if (!"PRODUCT_GROUP_PRICE".equals(pricingDetails.getType())) {
				throw new ServiceException(JSON_TYPE_MISMATCH, ERR_CORE_14);
			}
			ProductGroupPricing productGroupPricing = new ProductGroupPricing();
			productGroupPricing.validate(pricingDetails.getData());
		}
	}

	/**
	 * This method will add the ProductGroup depends to the ProductGroup from the
	 * ProductGroupDto and returns ProductGroup.
	 * 
	 * @param productGroup
	 * @param productGroupDto
	 * @return ProductGroup
	 */
	private ProductGroupDao addProductGroupDepends(ProductGroupDao productGroup, ProductGroupDto productGroupDto) {
		String itemTypeCode = productGroupDto.getItemTypeCode();
		if (itemTypeCode != null && itemTypeCode.length() > 0) {
			ItemTypeDao material = new ItemTypeDao();
			material.setItemTypeCode(itemTypeCode);
			productGroup.setItemType(material);
		} else {
			if (itemTypeCode != null && itemTypeCode.length() == 0) {
				productGroup.setItemType(null);
			}
		}
		String orgCode = productGroupDto.getOrgCode();
		if (orgCode != null && orgCode.length() > 0) {
			productGroup.setOrgCode(orgCode);
		} else {
			if (orgCode != null && orgCode.length() == 0) {
				productGroup.setOrgCode(null);
			}
		}
		return productGroup;
	}

	/**
	 * This method will update the ProductGroup details.
	 * 
	 * @param productGroupCode
	 * @param productGroupUpdateDto
	 * @return ProductGroupDto
	 */
	@Override
	public ProductGroupDto updateProductGroup(String productGroupCode, ProductGroupUpdateDto productGroupUpdateDto) {
		productGroupJsonValidation(productGroupUpdateDto.getConfigDetails(), productGroupUpdateDto.getPricingDetails());
		ProductGroupDao productGroup = productGroupRepository.findOneByProductGroupCode(productGroupCode);
		if (productGroup == null) {
			throw new ServiceException(
					NO_PRODUCTGROUP_DETAILS_FOUND_FOR_THE_REQUESTED_PRODUCTGROUPCODE + " : " + productGroupCode,
					ERR_PRO_004);
		}
		productGroup = (ProductGroupDao) MapperUtil.getObjectMapping(productGroupUpdateDto, productGroup);
		if (productGroupUpdateDto.getConfigDetails() != null) {
			productGroup.setConfigDetails(MapperUtil.getStringFromJson(productGroupUpdateDto.getConfigDetails()));
		}
		if (productGroupUpdateDto.getPricingDetails() != null) {
			productGroup.setPricingDetails(MapperUtil.getStringFromJson(productGroupUpdateDto.getPricingDetails()));
		}
		ProductGroupDto productGroupDto = (ProductGroupDto) MapperUtil.getObjectMapping(productGroupUpdateDto,
				new ProductGroupDto());
		productGroup.setSrcSyncId(productGroup.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> data = productGroupService.saveProductGroupToDB(productGroup, productGroupDto,
				ProductOperationCodes.PRODUCT_GROUP_UPDATE, true);
		syncDataService.publishProductMessages(data);
		productGroupDto = (ProductGroupDto) MapperUtil.getObjectMapping(productGroup, new ProductGroupDto());
		setConfigAndPricingDetailsJson(productGroup, productGroupDto);
		return getProductGroupDepends(productGroup, productGroupDto);
	}

	/**
	 * @param productGroupDto
	 * @param isPublishToEGHS
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveProductGroupToDB(ProductGroupDao productGroupDao,
			ProductGroupDto productGroupDto, String operation, boolean isPublishToEGHS) {
		// clearing the cache in engine service
		engineServiceClient.clearCache(productGroupCache, null);

		ProductGroupDao savedProductGroup = productGroupRepository
				.save(addProductGroupDepends(productGroupDao, productGroupDto));
		List<SyncData> syncDataList = new ArrayList<>();
		ProductGroupSyncDto productGroupSyncDto = new ProductGroupSyncDto(savedProductGroup);
		syncDataList.add(DataSyncUtil.createSyncData(productGroupSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getProductSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	@Override
	public ProductGroupDao getProductGroupDao(String productGroupCode) {
		return productGroupRepository.findOneByProductGroupCode(productGroupCode);
	}
}
