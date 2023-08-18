/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.BrandConfigDetails;
import com.titan.poss.core.dto.BrandCustomerDetails;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BrandPanCardDetails;
import com.titan.poss.core.dto.BrandTcsDetails;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.BrandDao;
import com.titan.poss.location.dao.OrganizationDao;
import com.titan.poss.location.dto.BrandSyncDto;
import com.titan.poss.location.dto.constants.LocationConstants;
import com.titan.poss.location.dto.request.BrandUpdateDto;
import com.titan.poss.location.dto.request.json.BrandCashMemoDetails;
import com.titan.poss.location.dto.request.json.BrandTaxDetails;
import com.titan.poss.location.dto.response.BrandLiteDto;
import com.titan.poss.location.repository.BrandRepositoryExt;
import com.titan.poss.location.service.BrandService;
import com.titan.poss.location.service.LocationSyncDataService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("brandService")
public class BrandServiceImpl implements BrandService {

	private static final String ERR_PRO_001 = "ERR-PRO-001";

	private static final String NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE = "No Brand details found for the requested brandCode";

	private static final String ERR_PRO_022 = "ERR-PRO-022";

	private static final String BRAND_CODE_IS_ALREADY_AVAILABLE = "BrandCode is already available";

	@Autowired
	private BrandRepositoryExt brandRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private BrandServiceImpl brandService;

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * isActive and parentBrandCode.
	 * 
	 * @param isActive
	 * @param parentBrandCode
	 * @param pageable
	 * @return PagedRestResponse<List<BrandDto>>
	 */
	@Override
	public PagedRestResponse<List<BrandDto>> listBrand(Boolean isActive, String parentBrandCode, Pageable pageable) {

		Page<BrandDao> brandList = getBrandsList(isActive, parentBrandCode, pageable);

		List<BrandDto> brandDtoList = new ArrayList<>();

		brandList.forEach(brand -> {

			BrandDto brandDto = (BrandDto) MapperUtil.getObjectMapping(brand, new BrandDto());

			brandDtoList.add(getBrandDepends(brand, brandDto));

		});

		return (new PagedRestResponse<>(brandDtoList, brandList));
	}

	private Page<BrandDao> getBrandsList(Boolean isActive, String parentBrandCode, Pageable pageable) {

		Page<BrandDao> brandList;

		if (parentBrandCode != null) {

			BrandDao brandCriteria = new BrandDao();
			brandCriteria.setIsActive(isActive);

			BrandDao parentBrand = new BrandDao();
			parentBrand.setBrandCode(parentBrandCode);

			brandCriteria.setParentBrand(parentBrand);

			ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
			Example<BrandDao> criteria = Example.of(brandCriteria, matcher);

			brandList = brandRepository.findAll(criteria, pageable);

		} else {

			List<Boolean> isActiveList = new ArrayList<>();

			if (isActive == null) {

				isActiveList.add(true);
				isActiveList.add(false);

			} else {

				isActiveList.add(isActive);
			}

			brandList = brandRepository.findParentBrands(isActiveList, pageable);

		}

		return brandList;
	}

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * parentBrandCode and isPageable.
	 * 
	 * @param parentBrandCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BrandLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<BrandLiteDto>> listBrandLite(String parentBrandCode, Boolean isPageable,
			Pageable pageable, List<String> parentBrandCodes) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Page<BrandDao> brandList = null;
		if (!CollectionUtil.isEmpty(parentBrandCodes)) {
			brandList = brandRepository.findSubBrands(parentBrandCodes, pageable);
		} else {
			brandList = getBrandsList(true, parentBrandCode, pageable);
		}

		List<BrandLiteDto> brandLiteDtoList = new ArrayList<>();

		brandList.forEach(brand -> {

			BrandLiteDto brandLiteDto = (BrandLiteDto) MapperUtil.getObjectMapping(brand, new BrandLiteDto());

			brandLiteDtoList.add(brandLiteDto);

		});

		return (new PagedRestResponse<>(brandLiteDtoList, brandList));

	}

	/**
	 * This method will return the Brand details based on the parentBrandCode and
	 * brandCode.
	 * 
	 * @param parentBrandCode
	 * @param brandCode
	 * @return BrandDto
	 */
	@Override
	public BrandDto getBrand(String parentBrandCode, String brandCode) {

		BrandDao brandCriteria = new BrandDao();
		brandCriteria.setBrandCode(brandCode);

		if (parentBrandCode != null) {

			BrandDao parentBrand = new BrandDao();
			parentBrand.setBrandCode(parentBrandCode);

			brandCriteria.setParentBrand(parentBrand);

		}

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<BrandDao> criteria = Example.of(brandCriteria, matcher);

		Optional<BrandDao> brandOpt = brandRepository.findOne(criteria);

		BrandDao brand = null;

		if (brandOpt.isPresent()) {

			brand = brandOpt.get();

		} else {

			throw new ServiceException(NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE, ERR_PRO_001);
		}

		BrandDto brandDto = (BrandDto) MapperUtil.getObjectMapping(brand, new BrandDto());

		return getBrandDepends(brand, brandDto);

	}

	/**
	 * This method will add the Brand depends to the BrandDto from the Brand and
	 * returns BrandDto.
	 * 
	 * @param brand
	 * @param brandDto
	 * @return BrandDto
	 */
	private BrandDto getBrandDepends(BrandDao brand, BrandDto brandDto) {

		try {

			brandDto.setParentBrandCode(brand.getParentBrand().getBrandCode());

		} catch (NullPointerException e) {

			brandDto.setParentBrandCode("");

		}

		try {

			brandDto.setOrgCode(brand.getOrganization().getOrgCode());

		} catch (NullPointerException e) {

			brandDto.setOrgCode("");

		}

		brandDto = (BrandDto) MapperUtil.getObjectMapping(getJsonMapping(brand, brandDto), brandDto);

		return brandDto;

	}

	/**
	 * @param brand
	 * @param brandDto
	 * @return
	 */
	private BrandDto getJsonMapping(BrandDao brand, BrandDto brandDto) {

		Object obj = MapperUtil.getJsonFromString(brand.getCmDetails());
		JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		brandDto.setCmDetails(jsonData);

		obj = MapperUtil.getJsonFromString(brand.getConfigDetails());
		jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		brandDto.setConfigDetails(jsonData);

		obj = MapperUtil.getJsonFromString(brand.getCustomerDetails());
		jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		brandDto.setCustomerDetails(jsonData);

		obj = MapperUtil.getJsonFromString(brand.getTaxDetails());
		jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		brandDto.setTaxDetails(jsonData);

		obj = MapperUtil.getJsonFromString(brand.getPanCardDetails());
		jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		brandDto.setPanCardDetails(jsonData);

		obj = MapperUtil.getJsonFromString(brand.getBrandTcsDetails());
		jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		brandDto.setBrandTcsDetails(jsonData);
		return brandDto;
	}

	/**
	 * This method will save the Brand details.
	 * 
	 * @param brandDto
	 * @return BrandDto
	 */
	@Override
	public BrandDto addBrand(BrandDto brandDto) {

		validateJsonForNull(brandDto);
		validateJsonRequest(brandDto);

		BrandDao brand = brandRepository.findOneByBrandCode(brandDto.getBrandCode());

		if (brand != null) {
			throw new ServiceException(BRAND_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_022);
		}

		if (brandDto.getParentBrandCode() == null) {
			brandDto.setParentBrandCode(brandDto.getBrandCode());
		}

		brand = (BrandDao) MapperUtil.getObjectMapping(brandDto, new BrandDao());

		setDetailsFields(brand, brandDto);

		brand.setSrcSyncId(0);
		brand.setDestSyncId(0);

		Map<String, SyncStagingDto> data = brandService.saveBrandToDB(brand, brandDto, ProductOperationCodes.BRAND_ADD,
				true);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);
		return brandDto;

	}

	/**
	 * @param brandDto
	 */
	private void validateJsonForNull(BrandDto brandDto) {

		if ((brandDto.getParentBrandCode() == null
				|| brandDto.getBrandCode().equalsIgnoreCase(brandDto.getParentBrandCode()))
				&& Boolean.TRUE.equals(brandDto.getIsActive())) {
			if (brandDto.getConfigDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_CONFIG_DETAILS, LocationConstants.ERR_LOC_041);

			if (brandDto.getCustomerDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_CUSTOMER_DETAILS, LocationConstants.ERR_LOC_042);

			if (brandDto.getTaxDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_TAX_DETAILS, LocationConstants.ERR_LOC_043);

			if (brandDto.getCmDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_CM_DETAILS, LocationConstants.ERR_LOC_044);

			if (brandDto.getPanCardDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_PAN_DETAILS, LocationConstants.ERR_LOC_044);

			if (brandDto.getBrandTcsDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_BRAND_TCS_DETAILS, LocationConstants.ERR_LOC_086);
		}
	}

	/**
	 * @param brand
	 * @param brandDto
	 */
	private void setDetailsFields(BrandDao brand, BrandDto brandDto) {
		if (brandDto.getConfigDetails() != null)
			brand.setConfigDetails(MapperUtil.getStringFromJson(brandDto.getConfigDetails()));

		if (brandDto.getCmDetails() != null)
			brand.setCmDetails(MapperUtil.getStringFromJson(brandDto.getCmDetails()));

		if (brandDto.getCustomerDetails() != null)
			brand.setCustomerDetails(MapperUtil.getStringFromJson(brandDto.getCustomerDetails()));

		if (brandDto.getTaxDetails() != null)
			brand.setTaxDetails(MapperUtil.getStringFromJson(brandDto.getTaxDetails()));

		if (brandDto.getPanCardDetails() != null)
			brand.setPanCardDetails(MapperUtil.getStringFromJson(brandDto.getPanCardDetails()));

		if (brandDto.getBrandTcsDetails() != null)
			brand.setBrandTcsDetails(MapperUtil.getStringFromJson(brandDto.getBrandTcsDetails()));

	}

	/**
	 * @param brandDto
	 */
	private void validateJsonRequest(BrandDto brandDto) {
		if (brandDto.getConfigDetails() != null)
			new BrandConfigDetails().validate(brandDto.getConfigDetails().getData());

		if (brandDto.getCmDetails() != null)
			new BrandCashMemoDetails().validate(brandDto.getCmDetails().getData());

		if (brandDto.getCustomerDetails() != null)
			new BrandCustomerDetails().validate(brandDto.getCustomerDetails().getData());

		if (brandDto.getTaxDetails() != null)
			new BrandTaxDetails().validate(brandDto.getTaxDetails().getData());

		if (brandDto.getPanCardDetails() != null)
			new BrandPanCardDetails().validate(brandDto.getPanCardDetails().getData());

		if (brandDto.getBrandTcsDetails() != null)
			new BrandTcsDetails().validate(brandDto.getBrandTcsDetails().getData());
	}

	/**
	 * This method will add the Brand depends to the Brand from the BrandDto and
	 * returns Brand.
	 * 
	 * @param brand
	 * @param brandDto
	 * @return Brand
	 */
	private BrandDao addBrandDepends(BrandDao brand, BrandDto brandDto) {

		String parentBrandCode = brandDto.getParentBrandCode();

		if (parentBrandCode != null && parentBrandCode.length() > 0) {

			BrandDao parentBrand = new BrandDao();
			parentBrand.setBrandCode(parentBrandCode);

			brand.setParentBrand(parentBrand);

		} else {

			if (parentBrandCode != null && parentBrandCode.length() == 0) {

				brand.setParentBrand(null);

			}

		}

		String orgCode = brandDto.getOrgCode();

		if (orgCode != null && orgCode.length() > 0) {

			OrganizationDao organization = new OrganizationDao();
			organization.setOrgCode(orgCode);

			brand.setOrganization(organization);

		} else {

			if (orgCode != null && orgCode.length() == 0) {

				brand.setOrganization(null);

			}

		}

		return brand;

	}

	/**
	 * This method will update the Brand details.
	 * 
	 * @param brandCode
	 * @param brandUpdateDto
	 * @return BrandDto
	 */
	@Override
	public BrandDto updateBrand(String brandCode, BrandUpdateDto brandUpdateDto) {

		BrandDao brand = brandRepository.findOneByBrandCode(brandCode);

		if (brand == null) {

			throw new ServiceException(NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE, ERR_PRO_001);
		}

		BrandDto brandDto = (BrandDto) MapperUtil.getObjectMapping(brandUpdateDto, new BrandDto());
		brandDto.setBrandCode(brandCode);
		validateJsonRequest(brandDto);

		brand = (BrandDao) MapperUtil.getObjectMapping(brandDto, brand);

		setDetailsFields(brand, brandDto);
		validateJsonForNullWhileUpdate(brand);

		brandDto.setBrandCode(brandCode);
		brand.setSrcSyncId(brand.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> data = brandService.saveBrandToDB(brand, brandDto,
				ProductOperationCodes.BRAND_UPDATE, true);

		// Publishing to POSS & EGHS
		syncDataService.publishLocationMessages(data);
		return getBrandDepends(brand, brandDto);
	}

	private void validateJsonForNullWhileUpdate(BrandDao brand) {
		if ((brand.getParentBrand().getBrandCode() == null
				|| brand.getBrandCode().equalsIgnoreCase(brand.getParentBrand().getBrandCode()))
				&& Boolean.TRUE.equals(brand.getIsActive())) {
			if (brand.getConfigDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_CONFIG_DETAILS, LocationConstants.ERR_LOC_041);

			if (brand.getCustomerDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_CUSTOMER_DETAILS, LocationConstants.ERR_LOC_042);

			if (brand.getTaxDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_TAX_DETAILS, LocationConstants.ERR_LOC_043);

			if (brand.getCmDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_CM_DETAILS, LocationConstants.ERR_LOC_044);

			if (brand.getPanCardDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_PAN_DETAILS, LocationConstants.ERR_LOC_044);

			if (brand.getBrandTcsDetails() == null)
				throw new ServiceException(LocationConstants.INVALID_BRAND_TCS_DETAILS, LocationConstants.ERR_LOC_086);
		}
	}

	/**
	 * @param brandDto
	 * @param isPublishToEGHS
	 * @param brand
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveBrandToDB(BrandDao brand, BrandDto brandDto, String operation,
			boolean isPublishToEGHS) {
		BrandDao savedBrand = brandRepository.save(addBrandDepends(brand, brandDto));
		List<SyncData> brandSyncDataList = new ArrayList<>();
		BrandSyncDto brandSyncDto = new BrandSyncDto(savedBrand);
		brandSyncDataList.add(DataSyncUtil.createSyncData(brandSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(brandSyncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

}
