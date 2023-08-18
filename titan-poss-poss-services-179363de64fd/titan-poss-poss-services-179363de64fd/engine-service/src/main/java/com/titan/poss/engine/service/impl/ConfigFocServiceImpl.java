/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dao.FocSchemeDetailsDao;
import com.titan.poss.config.dao.FocSchemeItemMappingDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.config.dao.FocSchemeProductMappingDao;
import com.titan.poss.core.dto.FocSchemeDetailsDto;
import com.titan.poss.core.dto.FocSchemeGrnDto;
import com.titan.poss.core.dto.FocSchemeIndividualDto;
import com.titan.poss.core.dto.FocSchemeItemMappingDto;
import com.titan.poss.core.dto.FocSchemeProductMappingDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.engine.config.repository.FocSchemeDetailsRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeItemMappingRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeMasterRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeProductMappingRepositoryExt;
import com.titan.poss.engine.service.ConfigFocService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class ConfigFocServiceImpl implements ConfigFocService {

	@Autowired
	private FocSchemeMasterRepositoryExt focSchemeMasterRepo;

	@Autowired
	private FocSchemeProductMappingRepositoryExt focSchemeProductMappingRepo;

	@Autowired
	private FocSchemeDetailsRepositoryExt focSchemeDetailsRepo;

	@Autowired
	private FocSchemeItemMappingRepositoryExt focSchemeItemMappingRepo;

	@Override
	public FocSchemeIndividualDto getFocSchemeConfigById(String schemeId) {

		// @formatter:off
		FocSchemeMasterDao focScheme = focSchemeMasterRepo.findById(schemeId).orElseThrow(
				() -> new ServiceException("FOC Scheme not found with the given id", "ERR-CONFIG-090", schemeId));

		FocSchemeGrnDto scheme = mapFocSchemeDto(focScheme);
		// scheme details
		List<FocSchemeDetailsDao> focSchemeDetails = focSchemeDetailsRepo
				.findAllByFocSchemeMasterDaoIdAndIsActive(focScheme.getId(), Boolean.TRUE);
		Set<FocSchemeDetailsDto> focSchemeDetailsDto = mapFocSchemeDetailsDto(schemeId, focSchemeDetails);

		// product mapping
		Set<FocSchemeProductMappingDao> focSchemeProducts = focSchemeProductMappingRepo
				.findAllByFocSchemeMasterDaoId(focScheme.getId());
		Set<FocSchemeProductMappingDto> focSchemeProductsDto = mapFocSchemeProductDto(schemeId, focSchemeProducts);

		// item mapping
		Set<FocSchemeItemMappingDao> focSchemeItems = focSchemeItemMappingRepo
				.findAllByFocSchemeMasterDaoId(focScheme.getId());
		Set<FocSchemeItemMappingDto> focSchemeItemsDto = mapFocSchemeItemDro(schemeId, focSchemeItems);

		FocSchemeIndividualDto focSchemeIndividualDto = new FocSchemeIndividualDto();
		focSchemeIndividualDto.setScheme(scheme);
		focSchemeIndividualDto.setSchemeDetails(focSchemeDetailsDto);
		focSchemeIndividualDto.setSchemeItemMapping(focSchemeItemsDto);
		focSchemeIndividualDto.setSchemeProductMapping(focSchemeProductsDto);
		return focSchemeIndividualDto;
		// @formatter:on
	}

	@Override
	public FocSchemeIndividualDto getFocSchemeDetails(String schemeId, String productGroup) {
		FocSchemeMasterDao focScheme = focSchemeMasterRepo.findById(schemeId).orElseThrow(
				() -> new ServiceException("FOC Scheme not found with the given id", "ERR-CONFIG-090", schemeId));
		FocSchemeGrnDto scheme = mapFocSchemeDto(focScheme);
		List<FocSchemeDetailsDao> focSchemeDetails = focSchemeDetailsRepo
				.findFocSchemeDetailsByProductGroup(focScheme.getId(), productGroup);
		Set<FocSchemeDetailsDto> focSchemeDetailsDto = mapFocSchemeDetailsDto(schemeId, focSchemeDetails);

		// product mapping
		Set<FocSchemeProductMappingDao> focSchemeProducts = focSchemeProductMappingRepo
				.findAllByFocSchemeMasterDaoId(focScheme.getId());
		Set<FocSchemeProductMappingDto> focSchemeProductsDto = mapFocSchemeProductDto(schemeId, focSchemeProducts);

		// item mapping
		Set<FocSchemeItemMappingDao> focSchemeItems = focSchemeItemMappingRepo
				.findAllByFocSchemeMasterDaoId(focScheme.getId());
		Set<FocSchemeItemMappingDto> focSchemeItemsDto = mapFocSchemeItemDro(schemeId, focSchemeItems);

		FocSchemeIndividualDto focSchemeIndividualDto = new FocSchemeIndividualDto();
		focSchemeIndividualDto.setScheme(scheme);
		focSchemeIndividualDto.setSchemeDetails(focSchemeDetailsDto);
		focSchemeIndividualDto.setSchemeItemMapping(focSchemeItemsDto);
		focSchemeIndividualDto.setSchemeProductMapping(focSchemeProductsDto);
		return focSchemeIndividualDto;
	}

	private Set<FocSchemeItemMappingDto> mapFocSchemeItemDro(String schemeId,
			Set<FocSchemeItemMappingDao> focSchemeItems) {
		Set<FocSchemeItemMappingDto> focSchemeItemsDto = new HashSet<>();

		for (FocSchemeItemMappingDao fsi : CollectionUtil.emptyIfNull(focSchemeItems)) {
			FocSchemeItemMappingDto fsiDto = (FocSchemeItemMappingDto) MapperUtil.getDtoMapping(fsi,
					FocSchemeItemMappingDto.class);
			fsiDto.setSchemeId(schemeId);
			FocSchemeMasterDao fsm = fsi.getFocSchemeMasterDao();
			if (fsm != null)
				fsiDto.setSchemeId(fsm.getId());
			focSchemeItemsDto.add(fsiDto);
		}
		return focSchemeItemsDto;
	}

	private Set<FocSchemeProductMappingDto> mapFocSchemeProductDto(String schemeId,
			Set<FocSchemeProductMappingDao> focSchemeProducts) {
		Set<FocSchemeProductMappingDto> focSchemeProductsDto = new HashSet<>();

		for (FocSchemeProductMappingDao fsp : CollectionUtil.emptyIfNull(focSchemeProducts)) {
			FocSchemeProductMappingDto fspDto = (FocSchemeProductMappingDto) MapperUtil.getDtoMapping(fsp,
					FocSchemeProductMappingDto.class);
			fspDto.setSchemeId(schemeId);
			FocSchemeDetailsDao fsd = fsp.getFocSchemeDetailsDao();
			if (fsd != null)
				fspDto.setSchemeDetailsId(fsd.getId());

			focSchemeProductsDto.add(fspDto);
		}
		return focSchemeProductsDto;
	}

	private Set<FocSchemeDetailsDto> mapFocSchemeDetailsDto(String schemeId,
			List<FocSchemeDetailsDao> focSchemeDetails) {
		Set<FocSchemeDetailsDto> focSchemeDetailsDto = new HashSet<>();

		for (FocSchemeDetailsDao fsd : CollectionUtil.emptyIfNull(focSchemeDetails)) {
			FocSchemeDetailsDto fsdDto = (FocSchemeDetailsDto) MapperUtil.getObjectMapping(fsd,
					new FocSchemeDetailsDto());
			fsdDto.setSchemeId(schemeId);
			focSchemeDetailsDto.add(fsdDto);
		}
		return focSchemeDetailsDto;
	}

	private FocSchemeGrnDto mapFocSchemeDto(FocSchemeMasterDao focScheme) {
		FocSchemeGrnDto scheme = new FocSchemeGrnDto();
		scheme.setSchemeId(focScheme.getId());
		if (!StringUtil.isBlankJsonStr(focScheme.getGrnConfig())) {
			scheme.setGrnConfigData(MapperUtil.mapObjToClass(focScheme.getGrnConfig(), JsonData.class));
		}
		if (!StringUtil.isBlankJsonStr(focScheme.getClubbingConfig())) {
			scheme.setClubbingConfig(MapperUtil.mapObjToClass(focScheme.getClubbingConfig(), JsonData.class));
		}
		return scheme;
	}

}
