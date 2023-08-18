/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.PurityDaoExt;
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.dto.PuritySyncDtoExt;
import com.titan.poss.product.dto.request.PurityCreateDto;
import com.titan.poss.product.repository.PurityRepositoryExt;
import com.titan.poss.product.service.PurityService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("purityService")
public class PurityServiceImpl implements PurityService {

	public static final String GOLD = "J";

	private static final String ERR_PRO_012 = "ERR-PRO-012";

	private static final String NO_PURITY_DETAILS_FOUND_FOR_THE_REQUESTED_ID = "No Purity details found for the requested Id";

	private static final String ERR_PRO_017 = "ERR-PRO-017";

	private static final String MATERIAL_TYPE_CODE_AND_PURITY_ARE_ALREADY_AVAILABLE = "MaterialTypeCode and Purity are already available";

	private static final String ERR_PRO_030 = "ERR-PRO-030";

	private static final String MATERIALTYPECODE_AND_OFFSET_ARE_ALREADY_AVAILABLE = "MaterialTypeCode and Offset are already available";

	private static final String ERR_PRO_031 = "ERR-PRO-031";

	private static final String MATERIALCODE_AND_KARAT_ARE_ALREADY_AVAILABLE = "MaterialCode and Karat are already available";

	@Autowired
	private PurityRepositoryExt purityRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private PurityServiceImpl purityService;

	/**
	 * This method will return the list of Purity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PurityDto>>
	 */
	@Override
	public PagedRestResponse<List<PurityDto>> listPurity(Boolean isActive, BigDecimal purityValue, String itemTypeCode,
			Pageable pageable) {

		Page<PurityDto> purityDtoList = purityRepository.findByItemTypeCodeAndPurityAndIsActive(itemTypeCode,
				purityValue, isActive, pageable);

		return (new PagedRestResponse<>(purityDtoList.getContent(), purityDtoList));
	}

	/**
	 * This method will add the Purity depends to the PurityDto from the Purity and
	 * returns PurityDto.
	 * 
	 * @param purity
	 * @param purityDto
	 * @return PurityDto
	 */
	private PurityDto getPurityDepends(PurityDaoExt purity, PurityDto purityDto) {

		purityDto.setItemTypeCode(purity.getItemType().getItemTypeCode());
		return purityDto;

	}

	/**
	 * This method will save the Purity details.
	 * 
	 * @param purityCreateDto
	 * @return PurityDto
	 */
	@Override
	public PurityDto addPurity(PurityCreateDto purityCreateDto) {

		validateIsDisplayed(purityCreateDto);
		ItemTypeDao itemType = new ItemTypeDao();

		if (!MetalTypeCodeEnum.getUniqueMetals().contains(purityCreateDto.getItemTypeCode())) {
			throw new ServiceException("Improper metal type passed", "ERR-LOC-068");
		}
		itemType.setItemTypeCode(purityCreateDto.getItemTypeCode());

		PurityDaoExt purity = purityRepository.findOneByItemTypeAndOffset(itemType, purityCreateDto.getOffset());

		if (!StringUtils.isEmpty(purity)) {
			throw new ServiceException(MATERIALTYPECODE_AND_OFFSET_ARE_ALREADY_AVAILABLE, ERR_PRO_030);
		}

		purity = purityRepository.findOneByItemTypeAndPurity(itemType, purityCreateDto.getPurity());

		if (purity != null) {
			throw new ServiceException(MATERIAL_TYPE_CODE_AND_PURITY_ARE_ALREADY_AVAILABLE, ERR_PRO_017);
		}

		if (!StringUtils.isEmpty(purityCreateDto.getKarat())) {
			purity = purityRepository.findOneByItemTypeAndKarat(itemType, purityCreateDto.getKarat());
		}

		if (purity != null) {
			throw new ServiceException(MATERIALCODE_AND_KARAT_ARE_ALREADY_AVAILABLE, ERR_PRO_031);
		}

		purity = (PurityDaoExt) MapperUtil.getObjectMapping(purityCreateDto, new PurityDaoExt());

		if (purity.getIsDisplayed() == null) {
			purity.setIsDisplayed(Boolean.FALSE);
		}
		purity.setSrcSyncId(0);
		purity.setDestSyncId(0);

		Map<String, SyncStagingDto> data = purityService.savePurityToDB(purity, purityCreateDto,
				ProductOperationCodes.PURITY_ADD, true);
		syncDataService.publishProductMessages(data);
		PurityDto purityDto = (PurityDto) MapperUtil.getObjectMapping(purity, new PurityDto());

		return getPurityDepends(purity, purityDto);
	}

	private void validateIsDisplayed(PurityCreateDto purityCreateDto) {
		if (purityCreateDto.getOffset().compareTo(new BigDecimal(1)) == 0 && !purityCreateDto.getIsDisplayed()) {
			// cannot keep isDispalyed false for offset 1 values
			throw new ServiceException("Cannot Set isDisplayed to false for offset 1", "ERR-PRO-032");
		}
	}

	/**
	 * This method will add the Purity depends to the Purity from the
	 * PurityCreateDto and returns Purity.
	 * 
	 * @param purity
	 * @param purityCreateDto
	 * @return Purity
	 */
	private PurityDaoExt addPurityDepends(PurityDaoExt purity, PurityCreateDto purityCreateDto) {

		String materialTypeCode = purityCreateDto.getItemTypeCode();
		ItemTypeDao itemType = new ItemTypeDao();
		itemType.setItemTypeCode(materialTypeCode);

		purity.setItemType(itemType);

		return purity;

	}

	/**
	 * This method will update the Purity details.
	 * 
	 * @param id
	 * @param purityCreateDto
	 * @return PurityDto
	 */
	@Override
	public PurityDto updatePurity(PurityCreateDto purityCreateDto) {

		validateIsDisplayed(purityCreateDto);
		if (!MetalTypeCodeEnum.getUniqueMetals().contains(purityCreateDto.getItemTypeCode())) {
			throw new ServiceException("Improper metal type passed", "ERR-LOC-068");
		}

		ItemTypeDao itemType = new ItemTypeDao();
		itemType.setItemTypeCode(purityCreateDto.getItemTypeCode());
		PurityDaoExt purity = purityRepository.findOneByItemTypeAndPurity(itemType, purityCreateDto.getPurity());

		if (purity == null) {
			throw new ServiceException(NO_PURITY_DETAILS_FOUND_FOR_THE_REQUESTED_ID, ERR_PRO_012);
		}

		purity = (PurityDaoExt) MapperUtil.getObjectMapping(purityCreateDto, purity);
		if (purity.getIsDisplayed() == null) {
			purity.setIsDisplayed(Boolean.FALSE);
		}
		purity.setSrcSyncId(purity.getSrcSyncId() + 1);

		Map<String, SyncStagingDto> data = purityService.savePurityToDB(purity, purityCreateDto,
				ProductOperationCodes.PURITY_UPDATE, true);
		syncDataService.publishProductMessages(data);
		PurityDto purityDto = (PurityDto) MapperUtil.getObjectMapping(purity, new PurityDto());

		return getPurityDepends(purity, purityDto);

	}

	/**
	 * @param purityDao
	 * @param purityDto
	 * @param operation
	 * @param isPublishToEGHS
	 * @return Map<String, SyncStagingDto>
	 */
	@Transactional
	public Map<String, SyncStagingDto> savePurityToDB(PurityDaoExt purityDao, PurityCreateDto purityDto,
			String operation, boolean isPublishToEGHS) {
		PurityDaoExt savedPuirty = purityRepository.save(addPurityDepends(purityDao, purityDto));
		List<SyncData> puritySyncData = new ArrayList<>();
		PuritySyncDtoExt puritySyncDto = new PuritySyncDtoExt(savedPuirty);
		puritySyncData.add(DataSyncUtil.createSyncData(puritySyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getProductSyncStagingMap(puritySyncData, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

}
