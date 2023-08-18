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

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.RegionLiteDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.OrganizationDao;
import com.titan.poss.location.dao.RegionDao;
import com.titan.poss.location.dto.RegionDto;
import com.titan.poss.location.dto.RegionSyncDto;
import com.titan.poss.location.dto.request.RegionUpdateDto;
import com.titan.poss.location.repository.OrganizationRepository;
import com.titan.poss.location.repository.RegionRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.RegionService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("regionService")
public class RegionServiceImpl implements RegionService {

	private static final String ERR_LOC_003 = "ERR-LOC-003";

	private static final String NO_REGION_DETAILS_FOUND_FOR_THE_REQUESTED_REGIONCODE = "No Region details found for the requested regionCode";

	private static final String ERR_LOC_012 = "ERR-LOC-012";

	private static final String REGION_CODE_IS_ALREADY_AVAILABLE = "RegionCode is already available";

	@Autowired
	private RegionRepositoryExt regionRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private RegionServiceImpl regionService;

	/**
	 * This method will return the list of Region details based on the isActive.
	 * 
	 * @param isActive
	 * @param parentRegionCode
	 * @param pageable
	 * @return PagedRestResponse<List<RegionDto>>
	 */
	@Override
	public PagedRestResponse<List<RegionDto>> listRegion(Boolean isActive, String parentRegionCode, Pageable pageable) {

		Page<RegionDao> regionList = getRegionsList(null, isActive, parentRegionCode, pageable);
		List<RegionDto> regionDtoList = new ArrayList<>();
		regionList.forEach(region -> {
			RegionDto regionDto = (RegionDto) MapperUtil.getObjectMapping(region, new RegionDto());
			regionDto.setOrgCode(region.getOrganization().getOrgCode());
			regionDto.setConfigDetails(MapperUtil.getJsonFromString(region.getConfigDetails()));
			regionDtoList.add(getRegionDepends(region, regionDto));
		});
		return (new PagedRestResponse<>(regionDtoList, regionList));
	}

	private Page<RegionDao> getRegionsList(String regionCode, Boolean isActive, String parentRegionCode,
			Pageable pageable) {

		Page<RegionDao> regionList;

		if (parentRegionCode != null || regionCode != null) {
			RegionDao regionCriteria = new RegionDao();
			regionCriteria.setIsActive(isActive);
			regionCriteria.setRegionCode(regionCode);

			if (parentRegionCode != null) {

				RegionDao parentRegion = new RegionDao();
				parentRegion.setRegionCode(parentRegionCode);

				regionCriteria.setParentRegion(parentRegion);
			}

			ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
			Example<RegionDao> criteria = Example.of(regionCriteria, matcher);

			regionList = regionRepository.findAll(criteria, pageable);

		} else {

			List<Boolean> isActiveList = new ArrayList<>();

			if (isActive == null) {

				isActiveList.add(true);
				isActiveList.add(false);

			} else {

				isActiveList.add(isActive);
			}

			regionList = regionRepository.findParentRegions(isActiveList, pageable);

		}

		return regionList;
	}

	/**
	 * This method will return the list of Region/Sub Region details based on the
	 * parentRegionCode and isPageable.
	 * 
	 * @param parentRegionCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<RegionLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<RegionLiteDto>> listRegionLite(String regionCode, String parentRegionCode,
			Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		Page<RegionDao> regionList = getRegionsList(regionCode, true, parentRegionCode, pageable);

		List<RegionLiteDto> regionLiteDtoList = new ArrayList<>();

		regionList.forEach(region -> {

			RegionLiteDto regionLiteDto = (RegionLiteDto) MapperUtil.getObjectMapping(region, new RegionLiteDto());

			regionLiteDtoList.add(regionLiteDto);

		});

		return (new PagedRestResponse<>(regionLiteDtoList, regionList));

	}

	/**
	 * This method will return the Region details based on the parentRegionCode and
	 * regionCode.
	 * 
	 * @param parentRegionCode
	 * @param regionCode
	 * @return RegionDto
	 */
	@Override
	public RegionDto getRegion(String parentRegionCode, String regionCode) {
		RegionDao regionCriteria = new RegionDao();
		regionCriteria.setRegionCode(regionCode);
		if (parentRegionCode != null) {
			RegionDao parentRegion = new RegionDao();
			parentRegion.setRegionCode(parentRegionCode);
			regionCriteria.setParentRegion(parentRegion);
		}
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<RegionDao> criteria = Example.of(regionCriteria, matcher);
		Optional<RegionDao> regionOpt = regionRepository.findOne(criteria);
		RegionDao region = null;
		if (regionOpt.isPresent()) {
			region = regionOpt.get();
		} else {
			throw new ServiceException(NO_REGION_DETAILS_FOUND_FOR_THE_REQUESTED_REGIONCODE, ERR_LOC_003);
		}
		RegionDto regionDto = (RegionDto) MapperUtil.getObjectMapping(region, new RegionDto());
		regionDto.setConfigDetails(MapperUtil.getJsonFromString(region.getConfigDetails()));
		regionDto.setOrgCode(region.getOrganization().getOrgCode());
		return getRegionDepends(region, regionDto);
	}

	/**
	 * This method will add the Region depends to the RegionDto from the Region and
	 * returns RegionDto.
	 * 
	 * @param region
	 * @param regionDto
	 * @return RegionDto
	 */
	private RegionDto getRegionDepends(RegionDao region, RegionDto regionDto) {

		try {

			regionDto.setParentRegionCode(region.getParentRegion().getRegionCode());

		} catch (NullPointerException e) {

			regionDto.setParentRegionCode("");

		}

		regionDto.setOrgCode(region.getOrganization().getOrgCode());
		return regionDto;

	}

	/**
	 * This method will save the Region details.
	 * 
	 * @param regionDto
	 * @return RegionDto
	 */
	@Override
	public RegionDto addRegion(RegionDto regionDto) {

		if (regionRepository.findOneByRegionCode(regionDto.getRegionCode()) != null) {
			throw new ServiceException(REGION_CODE_IS_ALREADY_AVAILABLE, ERR_LOC_012);
		}

		if (regionDto.getParentRegionCode() == null)
			regionDto.setParentRegionCode(regionDto.getRegionCode());

		OrganizationDao orgDao = organizationRepository.findOneByOrgCode(regionDto.getOrgCode());
		if (orgDao == null)
			throw new ServiceException("No org details found for the requested orgCode :" + regionDto.getOrgCode(),
					"ERR-LOC-035");

		RegionDao region1 = new RegionDao();
		MapperUtil.getObjectMapping(regionDto, region1);
		region1.setOrganization(orgDao);

		region1.setConfigDetails(MapperUtil.getStringFromJson(regionDto.getConfigDetails()));
		region1.setSrcSyncId(0);
		region1.setDestSyncId(0);

		RegionDao parentRegionDao = new RegionDao();
		parentRegionDao.setRegionCode(regionDto.getParentRegionCode());
		region1.setParentRegion(parentRegionDao);

		Map<String, SyncStagingDto> data = regionService.saveRegionToDB(region1, LocationOperationCodes.REGION_ADD,
				true);

		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessages(data);

		return regionDto;

	}

	/**
	 * @param region1
	 * @param operation
	 * @param isPublishToEGHS
	 * @return Map<String, SyncStagingDto>
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveRegionToDB(RegionDao region1, String operation, boolean isPublishToEGHS) {
		// saving region
		RegionDao region = regionRepository.save(region1);
		// converting to required json string
		List<SyncData> regionSyncData = new ArrayList<>();
		RegionSyncDto regionSyncDto = new RegionSyncDto(region);
		regionSyncData.add(DataSyncUtil.createSyncData(regionSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(regionSyncData, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * @param parentRegionCode
	 * @param region
	 */
	private void addParentRegion(String parentRegionCode, RegionDao region) {

		if (parentRegionCode != null && parentRegionCode.length() > 0) {
			RegionDao region1 = regionRepository.findOneByRegionCode(parentRegionCode);
			if (region1 == null) {
				throw new ServiceException("Parent Region code not found", "");
			}
			RegionDao parentRegion = (RegionDao) MapperUtil.getObjectMapping(region1, new RegionDao());

			region.setParentRegion(parentRegion);

		} else {

			if (parentRegionCode != null && parentRegionCode.length() == 0) {

				region.setParentRegion(null);

			}

		}

	}

	/**
	 * This method will update the Region details.
	 * 
	 * @param regionCode
	 * @param regionDto
	 * @return RegionUpdateDto
	 */
	@Override
	public RegionDto updateRegion(String regionCode, RegionUpdateDto regionUpdateDto) {

		RegionDao region = regionRepository.findOneByRegionCode(regionCode);

		if (region == null) {

			throw new ServiceException(NO_REGION_DETAILS_FOUND_FOR_THE_REQUESTED_REGIONCODE, ERR_LOC_003);
		}

		String configDetails = region.getConfigDetails();

		Object configDetailsPatch = regionUpdateDto.getConfigDetails();

		if (configDetailsPatch != null) {

			configDetails = MapperUtil.mergeJsonObjects(configDetailsPatch,
					MapperUtil.getJsonFromString(configDetails));

		}

		region = (RegionDao) MapperUtil.getObjectMapping(regionUpdateDto, region);

		region.setConfigDetails(configDetails);

		RegionDto regionDto = (RegionDto) MapperUtil.getObjectMapping(regionUpdateDto, new RegionDto());

		region.setSrcSyncId(region.getSrcSyncId() + 1);
		addParentRegion(regionDto.getParentRegionCode(), region);
		Map<String, SyncStagingDto> data = regionService.saveRegionToDB(region, LocationOperationCodes.REGION_UPDATE,
				true);

		regionDto = (RegionDto) MapperUtil.getObjectMapping(region, new RegionDto());

		regionDto.setConfigDetails(MapperUtil.getJsonFromString(region.getConfigDetails()));

		regionDto.setParentRegionCode(region.getParentRegion().getRegionCode());

		regionDto.setOrgCode(region.getOrganization().getOrgCode());

		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessages(data);

		return regionDto;

	}

}
