/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.CourierDao;
import com.titan.poss.inventory.dao.CourierLocationMappingDao;
import com.titan.poss.inventory.dto.AddRemoveLocationDto;
import com.titan.poss.inventory.dto.request.CourierUpdateDto;
import com.titan.poss.inventory.dto.response.CourierDto;
import com.titan.poss.inventory.repository.CourierLocationMappingRepository;
import com.titan.poss.inventory.repository.CourierRepository;
import com.titan.poss.inventory.service.CourierService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("courierService")
public class CourierServiceImpl implements CourierService {

	private static final String ERR_INV_029 = "ERR-INV-029";

	private static final String NO_COURIER_DETAILS_FOUND_FOR_THE_REQUESTED_ID = "No Courier details found for the requested id";

	private static final String DETAILS_ALREADY_EXISTS_FOR_THE_REQUESTED_ITEM = "Deatils already exists for the requested item.";

	private static final String ERR_INV_031 = "ERR-INV-031";

	@Autowired
	private CourierRepository courierRepository;

	@Autowired
	private CourierLocationMappingRepository courierLocationMappingRepository;

	/**
	 * This method will return the list of Courier details.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CourierDto>>
	 */
	@Override
	public PagedRestResponse<List<CourierDto>> listCourier(Boolean isActive, Pageable pageable) {
		Page<CourierDao> courierList;
		if (isActive == null) {
			courierList = courierRepository.findAll(pageable);
		} else {
			courierList = courierRepository.findByIsActive(isActive, pageable);
		}
		List<CourierDto> courierDtoList = new ArrayList<>();
		courierList.forEach(
				courier -> courierDtoList.add((CourierDto) MapperUtil.getDtoMapping(courier, CourierDto.class)));
		return (new PagedRestResponse<>(courierDtoList, courierList));
	}

	/**
	 * This method will return the Courier details based on the courierName.
	 * 
	 * @param courierName
	 * @return CourierDto
	 */
	@Override
	public CourierDto getCourier(String courierName) {
		CourierDao courier = courierRepository.findOneByCourierName(courierName);
		if (courier == null) {
			throw new ServiceException(NO_COURIER_DETAILS_FOUND_FOR_THE_REQUESTED_ID, ERR_INV_029);
		}
		return (CourierDto) MapperUtil.getDtoMapping(courier, CourierDto.class);
	}

	/**
	 * This method will save the Courier details.
	 * 
	 * @param courierDto
	 * @return CourierDto
	 */
	@Override
	@Transactional
	public CourierDto addCourier(CourierDto courierDto) {
		CourierDao courier = courierRepository.findOneByCourierName(courierDto.getCourierName());
		if (courier != null) {
			throw new ServiceException(DETAILS_ALREADY_EXISTS_FOR_THE_REQUESTED_ITEM, ERR_INV_031);
		}
		courier = (CourierDao) MapperUtil.getDtoMapping(courierDto, CourierDao.class);
		return (CourierDto) MapperUtil.getDtoMapping(courierRepository.save(courier), CourierDto.class);
	}

	/**
	 * This method will update the Courier details.
	 * 
	 * @param courierDto
	 * @return CourierDto
	 */
	@Override
	@Transactional
	public CourierDto updateCourier(String courierName, CourierUpdateDto courierUpdateDto) {
		CourierDao courier = courierRepository.findOneByCourierName(courierName);
		if (courier == null) {
			throw new ServiceException(NO_COURIER_DETAILS_FOUND_FOR_THE_REQUESTED_ID, ERR_INV_029);
		}
		courier = (CourierDao) MapperUtil.getObjectMapping(courierUpdateDto, courier);
		courier = courierRepository.save(courier);
		return (CourierDto) MapperUtil.getObjectMapping(courier, new CourierDto());
	}

	@Override
	public ListResponse<CourierDto> listCouriersByLocation(Boolean isActive, String locationCode) {
		List<CourierDao> courierList;
		if (isActive == null) {
			courierList = courierRepository.findAllByLocationCode(locationCode);
		} else {
			courierList = courierRepository.findAllByLocationCodeAndIsActive(locationCode, isActive);
		}
		List<CourierDto> courierDtoList = new ArrayList<>();

		courierList.forEach(
				courier -> courierDtoList.add((CourierDto) MapperUtil.getDtoMapping(courier, CourierDto.class)));

		return (new ListResponse<>(courierDtoList));

	}

	@Override
	public PagedRestResponse<List<CourierDto>> listCouriersByLocationByPage(Boolean isActive, String locationCode,
			Pageable pageable) {
		Page<CourierDao> courierList;
		if (isActive == null) {
			courierList = courierRepository.findAllByLocationCode(locationCode, pageable);
		} else {
			courierList = courierRepository.findAllByLocationCodeAndIsActive(locationCode, isActive, pageable);
		}
		List<CourierDto> courierDtoList = new ArrayList<>();

		courierList.forEach(
				courier -> courierDtoList.add((CourierDto) MapperUtil.getDtoMapping(courier, CourierDto.class)));
		return (new PagedRestResponse<>(courierDtoList, courierList));

	}

	@Override
	@Transactional
	public Boolean addRemoveLocationMapping(String courierName, AddRemoveLocationDto addRemoveLocationDto) {
		if (addRemoveLocationDto.getAddLocations() != null && !addRemoveLocationDto.getAddLocations().isEmpty()) {
			List<CourierLocationMappingDao> courierLocationMappings = new ArrayList<>();
			addRemoveLocationDto.getAddLocations().forEach(locationCode -> {
				if (!StringUtils.isEmpty(locationCode)) {
					CourierLocationMappingDao courierLocationMapping = new CourierLocationMappingDao();
					CourierDao courier = new CourierDao();
					courier.setCourierName(courierName);
					courierLocationMapping.setCourier(courier);
					courierLocationMapping.setLocationCode(locationCode);
					courierLocationMappings.add(courierLocationMapping);
				}
			});
			courierLocationMappingRepository.saveAll(courierLocationMappings);
		}

		if (addRemoveLocationDto.getRemoveLocations() != null && !addRemoveLocationDto.getRemoveLocations().isEmpty()) {
			courierLocationMappingRepository.deleteByCourierNameAndLocationCodeIn(courierName,
					addRemoveLocationDto.getRemoveLocations());
		}
		return true;

	}

	@Override
	public ListResponse<String> getLocationCodes(String courierName, Boolean isActive) {
		List<Boolean> isActiveList = new ArrayList<>();
		if (isActive == null) {
			isActiveList.add(Boolean.TRUE);
			isActiveList.add(Boolean.FALSE);
		} else {
			isActiveList.add(isActive);
		}
		List<String> courierLists = courierLocationMappingRepository
				.getLocationCodesByCourierNameAndIsActive(courierName, isActiveList);
		return new ListResponse<>(courierLists);
	}
}
