/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.VendorDto;
import com.titan.poss.integration.dto.request.VendorUpdateDto;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.VendorService;
import com.titan.poss.integration.service.factory.VendorDetailsFactory;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("IntegrationVendorService")
public class VendorServiceImpl implements VendorService {

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private VendorDetailsFactory vendorDetailsFactory;

	@Override
	public VendorDao getActiveByVendorType(VendorTypeEnum vendorType) {
		List<VendorDao> vendors = vendorRepo.findAllByVendorTypeAndIsActiveTrue(vendorType.name());
		if (vendors.isEmpty())
			throw new ServiceException("Record not found", "ERR-INT-006",
					"No active vendor details found: " + vendorType.name());
		if (vendors.size() > 1)
			throw new ServiceException("More than 1 records found", "ERR-INT-007",
					"More than one active vendor details found: " + vendorType.name());
		VendorDao intg = vendors.get(0);
		checkPortIsNumber(intg);
		return intg;
	}

	private void checkPortIsNumber(VendorDao vendor) {
		try {
			Integer.parseInt(vendor.getPort());
		} catch (NumberFormatException e) {
			throw new ServiceException("Invalid port", "ERR-INT-008", vendor.getVendorCode() + ": " + vendor.getPort());
		}
	}

	@Override
	public VendorDto getVendorByVendorCode(String vendorCode) {
		VendorDao vendor = vendorRepo.findByVendorCode(vendorCode);
		if (vendor == null) {
			throw new ServiceException("Vendor not present", "ERR-INT-015");
		}
		return convertVendorDaoToDto(vendor);
	}

	private VendorDto convertVendorDaoToDto(VendorDao vendor) {
		VendorDto vendorDto = (VendorDto) MapperUtil.getDtoMapping(vendor, VendorDto.class);
		if (vendor.getVendorDetails() != null) {
			vendorDto.setVendorDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), JsonData.class));
		}
		return vendorDto;
	}

	@Override
	public VendorDto getVendorByVendorType(String vendorTypeStr) {
		VendorDao vendor = getActiveByVendorType(VendorTypeEnum.valueOf(vendorTypeStr));
		return convertVendorDaoToDto(vendor);
	}

	@Override
	public PagedRestResponse<List<VendorDto>> getAllVendors(Boolean isActive, Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		VendorDao vendorCritiria = new VendorDao();
		vendorCritiria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<VendorDao> criteria = Example.of(vendorCritiria, matcher);

		Page<VendorDao> vendors = vendorRepo.findAll(criteria, pageable);
		List<VendorDto> vendorDtoList = new ArrayList<>();
		vendors.forEach(vendor -> {
			VendorDto vendorDto = (VendorDto) MapperUtil.getObjectMapping(vendor, new VendorDto());
			vendorDto.setVendorDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), JsonData.class));
			vendorDtoList.add(vendorDto);
		});
		return  new PagedRestResponse<>(vendorDtoList, vendors);

	}

	@Override
	@Transactional
	public VendorDto updateVendor(String vendorCode, VendorUpdateDto vendorUpdateDto) {

		BaseFieldsValidator vendorValidateDto = vendorDetailsFactory.getVendorConfig(vendorCode);
		vendorValidateDto.validate(vendorUpdateDto.getVendorDetails());

		VendorDao vendor = vendorRepo.findByVendorCode(vendorCode);
		if (vendor == null) {
			throw new ServiceException("Vendor to be updated not present", "ERR-INT-015");
		}
		VendorDao updatedVendorDao = (VendorDao) MapperUtil.getObjectMapping(vendorUpdateDto, vendor);
		if (vendorUpdateDto.getVendorDetails() != null) {
			updatedVendorDao.setVendorDetails(MapperUtil.getJsonString(vendorUpdateDto.getVendorDetails()));
		}
		VendorDao savedVendorDao = vendorRepo.save(updatedVendorDao);
		VendorDto vendorDto = (VendorDto) MapperUtil.getObjectMapping(savedVendorDao, new VendorDto());
		vendorDto.setVendorDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(savedVendorDao.getVendorDetails()), JsonData.class));
		return vendorDto;
	}

	@Override
	@Transactional
	public VendorDto createVendor(VendorDto vendorDto) {
		BaseFieldsValidator vendorValidateDto = vendorDetailsFactory.getVendorConfig(vendorDto.getVendorCode());
		vendorValidateDto.validate(vendorDto.getVendorDetails());

		VendorDao vendor = vendorRepo.findByVendorCode(vendorDto.getVendorCode());
		if (vendor != null) {
			throw new ServiceException("Vendor already present", "ERR-INT-036");
		}
		VendorDao vendorDao = (VendorDao) MapperUtil.getObjectMapping(vendorDto, new VendorDao());
		if (vendorDto.getVendorDetails() != null) {
			vendorDao.setVendorDetails(MapperUtil.getJsonString(vendorDto.getVendorDetails()));
		}
		VendorDao savedVendorDao = vendorRepo.save(vendorDao);
		VendorDto savedVendorDto = (VendorDto) MapperUtil.getObjectMapping(savedVendorDao, new VendorDto());
		savedVendorDto.setVendorDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(savedVendorDao.getVendorDetails()), JsonData.class));
		return savedVendorDto;
	}

}