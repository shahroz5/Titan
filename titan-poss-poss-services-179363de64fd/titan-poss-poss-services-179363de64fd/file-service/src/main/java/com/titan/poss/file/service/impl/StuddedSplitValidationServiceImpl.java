/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.StuddedSplitDtlDto;
import com.titan.poss.file.dto.StuddedSplitLdtlDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.StuddedSplitValidationService;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.repository.ItemRepository;
import com.titan.poss.product.repository.StoneRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class StuddedSplitValidationServiceImpl implements StuddedSplitValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private ItemRepository itemRepository;

	@Autowired
	private StoneRepository stoneRepository;

	@Override
	public boolean validateFileColumnLength(File studdedSplitFile) {
		List<String[]> list = FileUtil.readFile(studdedSplitFile, DelimiterEnum.PSV.getValue().charAt(0), 0);
		for (String[] stringList : list) {
			if (stringList.length != 1 && !validateFileColumns(stringList)) {
				return false;
			}
		}
		return true;
	}

	private boolean validateFileColumns(String[] stringList) {
		return ((stringList[0].equals("PHDR")
				&& stringList.length - 1 == FileIntegrationConstants.STUDDED_SPLIT_HDR_COLUMN_COUNT)
				|| (stringList[0].equals("CHDR")
						&& stringList.length - 1 == FileIntegrationConstants.STUDDED_SPLIT_HDR_COLUMN_COUNT)
				|| (stringList[0].equals("PDTL")
						&& stringList.length - 1 == FileIntegrationConstants.STUDDED_SPLIT_DTL_COLUMN_COUNT)
				|| (stringList[0].equals("CDTL")
						&& stringList.length - 1 == FileIntegrationConstants.STUDDED_SPLIT_DTL_COLUMN_COUNT)
				|| (stringList[0].equals("PLDTL")
						&& stringList.length - 1 == FileIntegrationConstants.STUDDED_SPLIT_LDTL_COLUMN_COUNT)
				|| (stringList[0].equals("CLDTL")
						&& stringList.length - 1 == FileIntegrationConstants.STUDDED_SPLIT_LDTL_COLUMN_COUNT));

	}

	@Override
	public boolean validateDtlDto(StuddedSplitDtlDto dtlDto) {

		// validate item code
		ItemDao item = itemRepository.findByItemCodeAndIsActive(dtlDto.getItemCode(), true);
		if (item == null) {
			dataAuditService.saveDataAuditData(dtlDto.getDetail(), MapperUtil.getJsonString(dtlDto),
					"Item code: " + dtlDto.getItemCode() + " is not present/active.", dtlDto.getFileId(),
					ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public boolean validateLdtlDto(StuddedSplitLdtlDto ldtlDto) {
		// validate stone code
		StoneDao stone = stoneRepository.findByStoneCodeAndIsActive(ldtlDto.getStoneCode(), true);
		if (stone == null) {
			dataAuditService.saveDataAuditData(ldtlDto.getLineDetail(), MapperUtil.getJsonString(ldtlDto),
					"Stone code: " + ldtlDto.getStoneCode() + " is not present/active.", ldtlDto.getFileId(),
					ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public boolean validateDtlWeights(List<StuddedSplitDtlDto> dtlDtos) {
		boolean valid = true;
		List<StuddedSplitDtlDto> pdtlDtos = dtlDtos.stream()
				.filter(dtlDto -> dtlDto.getDetail().equalsIgnoreCase("PDTL")).collect(Collectors.toList());
		for (StuddedSplitDtlDto pdtlDto : pdtlDtos) {
			List<StuddedSplitDtlDto> cdtlDtos = dtlDtos.stream()
					.filter(dtlDto -> dtlDto.getDetail().equalsIgnoreCase("CDTL")
							&& pdtlDto.getLineItemNumber().equals(dtlDto.getParentLineItemNumber()))
					.collect(Collectors.toList());

			// validating weight
			BigDecimal pdtlWeight = new BigDecimal(pdtlDto.getWeight());
			BigDecimal cdtlWeight = cdtlDtos.stream().map(cdtl -> new BigDecimal(cdtl.getWeight()))
					.reduce(BigDecimal.ZERO, BigDecimal::add);
			if (pdtlWeight.compareTo(cdtlWeight) != 0) {
				dataAuditService.saveDataAuditData(pdtlDto.getDetail(), MapperUtil.getJsonString(pdtlDto),
						"Weight in PDTL(" + pdtlWeight + ") doesn't match with weight in CDTL(" + cdtlWeight + ")",
						pdtlDto.getFileId(), ErrorTypeEnum.ERROR.toString());
				valid = false;
			}
			// validating diamond + other stone weight
			BigDecimal pdtlDiamondStoneWeight = new BigDecimal(pdtlDto.getDiamondWeight())
					.add(new BigDecimal(pdtlDto.getOtherStoneWeight()));
			BigDecimal cdtlDiamondStoneWeight = cdtlDtos.stream().map(
					cdtl -> new BigDecimal(cdtl.getDiamondWeight()).add(new BigDecimal(cdtl.getOtherStoneWeight())))
					.reduce(BigDecimal.ZERO, BigDecimal::add);
			if (pdtlDiamondStoneWeight.compareTo(cdtlDiamondStoneWeight) != 0) {
				dataAuditService.saveDataAuditData(pdtlDto.getDetail(), MapperUtil.getJsonString(pdtlDto),
						"Sum of diamond and other stone weight in PDTL(" + pdtlDiamondStoneWeight
								+ ") doesnt match with sum of diamond and other stone weight in CDTL("
								+ cdtlDiamondStoneWeight + ")",
						pdtlDto.getFileId(), ErrorTypeEnum.ERROR.toString());
				valid = false;
			}
		}
		return valid;
	}

}
