/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.service.impl;

import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.report.dao.ReportLovDaoExt;
import com.titan.poss.report.dto.LovTypesDto;
import com.titan.poss.report.dto.constants.LovTypeEnum;
import com.titan.poss.report.dto.request.LovCreateDto;
import com.titan.poss.report.dto.request.LovUpdateDto;
import com.titan.poss.report.repository.ReportLovRepositoryExt;
import com.titan.poss.report.service.LovService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("lovServiceImpl")
public class LovServiceImpl implements LovService {
	private static final String ERR_REP_001 = "ERR-REP-031";

	private static final String LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE = "LovType and code is already available";

	@Autowired
	private ReportLovRepositoryExt lovRepository;

	/**
	 * This method will return the list of lovTypes.
	 *
	 * @return LovTypesDto
	 */
	@Override
	public LovTypesDto getLovTypes() {
		LovTypeEnum[] lovTypeEnumList = LovTypeEnum.values();
		List<String> lovTypes = new ArrayList<>();
		for (LovTypeEnum lovTypeEnum : lovTypeEnumList) {
			lovTypes.add(lovTypeEnum.toString());
		}
		LovTypesDto lovTypesDto = new LovTypesDto();
		lovTypesDto.setLovTypes(lovTypes);
		return lovTypesDto;
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 *
	 * @param lovType
	 * @return LovDto
	 */
	@Override
	public LovDto getLov(String lovType, String lovCode) {
		List<ReportLovDaoExt> reportLovList = lovRepository.findByLovTypeAndCode(lovType, lovCode);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!reportLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = new ArrayList<>();
			reportLovList.forEach(configLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(configLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoList);
		} else {
			lovDto.setResults(new ArrayList<>());
		}
		return lovDto;
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 *
	 * @param
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@Override
	public LovCreateDto createLov(LovCreateDto lovCreateDto) {
		ReportLovDaoExt reportLovCriteria = new ReportLovDaoExt();
		reportLovCriteria.setLovType(lovCreateDto.getLovType());
		reportLovCriteria.setCode(lovCreateDto.getCode());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ReportLovDaoExt> criteria = Example.of(reportLovCriteria, matcher);
		Optional<ReportLovDaoExt> repLovOpt = lovRepository.findOne(criteria);
		if (!repLovOpt.isEmpty()) {
			throw new ServiceException(LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE, ERR_REP_001);
		}
		ReportLovDaoExt repLov = (ReportLovDaoExt) MapperUtil.getObjectMapping(lovCreateDto, new ReportLovDaoExt());
		repLov.setIsActive(true);
		repLov.setLovType(lovCreateDto.getLovType());
		lovRepository.save(repLov);
		return lovCreateDto;
	}

	/**
	 * This method will update the Lov details based on the lovType.
	 *
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@Override
	public LovDto updateLov(String lovType, LovUpdateDto lovUpdateDto) {
		List<ReportLovDaoExt> repLovList = lovRepository.findByLovType(lovType);
		int size = repLovList.size();
		List<KeyValueDto> keyValueDtoList = lovUpdateDto.getValues();
		int sizeDto = keyValueDtoList.size();
		for (int i = 0; i < sizeDto; i++) {
			Integer index = null;
			for (int j = 0; j < size; j++) {
				if (repLovList.get(j).getCode().equalsIgnoreCase(keyValueDtoList.get(i).getCode())) {
					index = j;
					break;
				}
			}
			if (index != null) {
				ReportLovDaoExt repLov = repLovList.get(index);
				repLov.setValue(keyValueDtoList.get(i).getValue());
				repLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				repLovList.set(index, repLov);
			} else {
				ReportLovDaoExt repLov = new ReportLovDaoExt();
				repLov.setLovType(lovType);
				repLov.setCode(keyValueDtoList.get(i).getCode());
				repLov.setValue(keyValueDtoList.get(i).getValue());
				repLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				repLovList.add(repLov);
			}
		}

		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!repLovList.isEmpty()) {
			lovRepository.saveAll(repLovList);
			List<KeyValueDto> keyValueDtoResList = new ArrayList<>();
			repLovList.forEach(repLov -> keyValueDtoResList
					.add((KeyValueDto) MapperUtil.getObjectMapping(repLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoResList);
		} else {
			lovDto.setResults(new ArrayList<>());
		}
		return lovDto;
	}
}