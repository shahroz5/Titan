/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.request.ProductCategoryUpdateDto;
import com.titan.poss.product.repository.ProductCategoryRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.ProductCategoryService;
import com.titan.poss.product.sync.dto.ProductCategorySyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("productCategoryService")
public class ProductCategoryServiceImpl implements ProductCategoryService {

	private static final String ERR_PRO_005 = "ERR-PRO-005";

	private static final String NO_PRODUCTCATEGORY_DETAILS_FOUND_FOR_THE_REQUESTED_PRODUCTCATEGORYCODE = "No ProductCategory details found for the requested productCategoryCode";

	private static final String ERR_PRO_015 = "ERR-PRO-015";

	private static final String PRODUCT_CATEGORY_CODE_IS_ALREADY_AVAILABLE = "ProductCategoryCode is already available";

	@Value("${productCategoryCache}")
	private String productCategoryCache;

	@Autowired
	private ProductCategoryRepositoryExt productCategoryRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;

	@Autowired
	private ProductCategoryServiceImpl productCategoryService;

	@Autowired
	private EngineServiceClient engineServiceClient;

	/**
	 * This method will return the list of ProductCategory details based on the
	 * isActive.
	 * 
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ProductCategoryDto>>
	 */
	@Override
	public PagedRestResponse<List<ProductCategoryDto>> listProductCategory(Boolean isActive,
			Boolean isConversionEnabled, Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		ProductCategoryDao productCategoryCriteria = new ProductCategoryDao();
		productCategoryCriteria.setIsActive(isActive);
		productCategoryCriteria.setIsConversionEnabled(isConversionEnabled);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ProductCategoryDao> criteria = Example.of(productCategoryCriteria, matcher);
		Page<ProductCategoryDao> productCategoryList = productCategoryRepository.findAll(criteria, pageable);
		List<ProductCategoryDto> productCategoryDtoList = new ArrayList<>();
		productCategoryList.forEach(productCategory -> {
			ProductCategoryDto productCategoryDto = (ProductCategoryDto) MapperUtil.getObjectMapping(productCategory,
					new ProductCategoryDto());
			productCategoryDtoList.add(getProductCategoryDepends(productCategory, productCategoryDto));
		});
		return (new PagedRestResponse<>(productCategoryDtoList, productCategoryList));
	}

	/**
	 * This method will return the ProductCategory details based on the
	 * productCategoryCode.
	 * 
	 * @param productCategoryCode
	 * @return ProductCategoryDto
	 */
	@Override
	public ProductCategoryDto getProductCategory(String productCategoryCode) {
		ProductCategoryDao productCategory = productCategoryRepository
				.findOneByProductCategoryCode(productCategoryCode);
		if (productCategory == null) {
			throw new ServiceException(NO_PRODUCTCATEGORY_DETAILS_FOUND_FOR_THE_REQUESTED_PRODUCTCATEGORYCODE,
					ERR_PRO_005);
		}
		ProductCategoryDto productCategoryDto = (ProductCategoryDto) MapperUtil.getObjectMapping(productCategory,
				new ProductCategoryDto());
		return getProductCategoryDepends(productCategory, productCategoryDto);
	}

	/**
	 * This method will add the ProductCategory depends to the ProductCategoryDto
	 * from the ProductCategory and returns ProductCategoryDto.
	 * 
	 * @param productCategory
	 * @param productCategoryDto
	 * @return ProductCategoryDto
	 */
	private ProductCategoryDto getProductCategoryDepends(ProductCategoryDao productCategory,
			ProductCategoryDto productCategoryDto) {
		JsonData hallmarkDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(productCategory.getHallmarkDetails()), JsonData.class);
		productCategoryDto.setHallmarkDetails(hallmarkDetails);
		try {
				productCategoryDto.setOrgCode(productCategory.getOrgCode());
		} catch (NullPointerException e) {
			productCategoryDto.setOrgCode("");
		}
		return productCategoryDto;
	}

	/**
	 * This method will save the ProductCategory details.
	 * 
	 * @param productCategoryDto
	 * @return ProductCategoryDto
	 */
	@Override
	public ProductCategoryDto addProductCategory(ProductCategoryDto productCategoryDto) {
		ProductCategoryDao productCategory = productCategoryRepository
				.findOneByProductCategoryCode(productCategoryDto.getProductCategoryCode());
		if (productCategory != null) {
			throw new ServiceException(PRODUCT_CATEGORY_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_015);
		}
		productCategory = (ProductCategoryDao) MapperUtil.getObjectMapping(productCategoryDto,
				new ProductCategoryDao());
		productCategory.setHallmarkDetails(MapperUtil.getStringFromJson(productCategoryDto.getHallmarkDetails()));
		productCategory.setSrcSyncId(0);
		productCategory.setDestSyncId(0);
		
		SyncStagingDto data = productCategoryService.saveProductCategoryToDB(productCategory, productCategoryDto,
				ProductOperationCodes.PRODUCT_CATEGORY_ADD);
		syncDataService.publishProductMessagesToQueue(data);
		return productCategoryDto;
	}

	/**
	 * This method will add the ProductCategory depends to the ProductCategory from
	 * the ProductCategoryDto and returns ProductCategory.
	 * 
	 * @param productCategory
	 * @param productCategoryDto
	 * @return ProductCategory
	 */
	private ProductCategoryDao addProductCategoryDepends(ProductCategoryDao productCategory,
			ProductCategoryDto productCategoryDto) {

		String orgCode = productCategoryDto.getOrgCode();

		if (orgCode != null && orgCode.length() > 0) {
			productCategory.setOrgCode(orgCode);

		} else {
			if (orgCode != null && orgCode.length() == 0) {
				productCategory.setOrgCode(null);
			}
		}

		return productCategory;

	}

	/**
	 * This method will update the ProductCategory details.
	 * 
	 * @param productCategoryCode
	 * @param productCategoryUpdateDto
	 * @return ProductCategoryDto
	 */
	@Override
	public ProductCategoryDto updateProductCategory(String productCategoryCode,
			ProductCategoryUpdateDto productCategoryUpdateDto) {
		ProductCategoryDao productCategory = productCategoryRepository
				.findOneByProductCategoryCode(productCategoryCode);
		if (productCategory == null) {
			throw new ServiceException(NO_PRODUCTCATEGORY_DETAILS_FOUND_FOR_THE_REQUESTED_PRODUCTCATEGORYCODE + " : "
					+ productCategoryCode, ERR_PRO_005);
		}
		productCategory = (ProductCategoryDao) MapperUtil.getObjectMapping(productCategoryUpdateDto, productCategory);
		if (productCategoryUpdateDto.getHallmarkDetails() != null)
			productCategory
					.setHallmarkDetails(MapperUtil.getStringFromJson(productCategoryUpdateDto.getHallmarkDetails()));
		ProductCategoryDto productCategoryDto = (ProductCategoryDto) MapperUtil
				.getObjectMapping(productCategoryUpdateDto, new ProductCategoryDto());
		productCategory.setSrcSyncId(productCategory.getSrcSyncId() + 1);
		SyncStagingDto data = productCategoryService.saveProductCategoryToDB(productCategory, productCategoryDto,
				ProductOperationCodes.PRODUCT_CATEGORY_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		productCategoryDto = (ProductCategoryDto) MapperUtil.getObjectMapping(productCategory,
				new ProductCategoryDto());
		return getProductCategoryDepends(productCategory, productCategoryDto);
	}

	/**
	 * @param productCategoryDao
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveProductCategoryToDB(ProductCategoryDao productCategoryDao,
			ProductCategoryDto productCategoryDto, String operation) {
		// // clearing the cache in engine service
		engineServiceClient.clearCache(productCategoryCache, null);
		ProductCategoryDao savedProductCategory = productCategoryRepository
				.save(addProductCategoryDepends(productCategoryDao, productCategoryDto));
		List<SyncData> syncData = new ArrayList<>();
		ProductCategorySyncDto productCategorySyncDto = new ProductCategorySyncDto(savedProductCategory);
		syncData.add(DataSyncUtil.createSyncData(productCategorySyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest messageRqst = DataSyncUtil.createMessageRequest(syncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(messageRqst);
		syncStagingDto.setMessageRequest(messageRqst);
		SyncStaging stagingMsg = new SyncStaging();
		stagingMsg.setMessage(requestBody);
		stagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stagingMsg = productSyncStagingRepository.save(stagingMsg);
		syncStagingDto.setId(stagingMsg.getId());
		return syncStagingDto;
	}

	@Override
	public ProductCategoryDao getProductCategoryDao(String productCategoryCode) {
		return productCategoryRepository.findOneByProductCategoryCode(productCategoryCode);
	}

}
