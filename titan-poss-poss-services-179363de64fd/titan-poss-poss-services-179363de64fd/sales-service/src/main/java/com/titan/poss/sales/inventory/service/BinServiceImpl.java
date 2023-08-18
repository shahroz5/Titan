/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.inventory.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.BinGroupEnumWoFOC;
import com.titan.poss.inventory.dto.constants.BinRequestType;
import com.titan.poss.inventory.dto.response.BinDetailsDto;
import com.titan.poss.inventory.repository.BinRepository;
import com.titan.poss.sales.service.EngineService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("binService")
@Transactional
public class BinServiceImpl implements BinService {

	@Autowired
	EngineService engineService;

	@Autowired
	private BinRepository binRepository;

	/**
	 * This method will return the list of Bins based on binRequestType and
	 * userType.
	 * 
	 * @param binRequestType
	 * @param userType
	 * @return ListResponse<BinDetailsDto>
	 */
	@Override
	public ListResponse<BinDetailsDto> listBin(String binRequestType, UserTypeEnum userType) {
		List<String> binGroupCodeList = null;
		List<BinDetailsDto> binDetailsDtoList = new ArrayList<>();
		if (binRequestType.equals(BinRequestType.ISSUE_BIN.toString())) {
			binGroupCodeList = BinGroupEnum.issueBin(userType);
			if (binGroupCodeList.isEmpty()) {
				return new ListResponse<>(binDetailsDtoList);
			}
		} else {
			if (binRequestType.equals(BinRequestType.RECEIVE_BIN.toString())) {
				binGroupCodeList = BinGroupEnum.receiveBin(userType);
				if (binGroupCodeList.isEmpty()) {
					return new ListResponse<>(binDetailsDtoList);
				}
			} else {
				return new ListResponse<>(binDetailsDtoList);
			}
		}
		List<BinDao> binList = binRepository.listBin(binGroupCodeList, true);
		binList.forEach(bin -> {
			BinDetailsDto binDetailsDto = new BinDetailsDto();
			binDetailsDto.setBinCode(bin.getBinCode());
			binDetailsDto.setBinGroupCode(bin.getBinGroup().getBinGroupCode());
			binDetailsDtoList.add(binDetailsDto);
		});
		return new ListResponse<>(binDetailsDtoList);
	}

	@Override
	public List<String> getBinGroupList(String binRequestType, UserTypeEnum userType) {
		List<String> binGroupCodeList = null;
		LocationCacheDto locationCacheDtoBtq = engineService.getStoreLocation(CommonUtil.getLocationCode());

		if (binRequestType.equals(BinRequestType.ISSUE_BIN.toString())) {
			if (locationCacheDtoBtq.getOfferDetails().getBintobintransferallowedforFOCitems())
				binGroupCodeList = BinGroupEnum.issueBin(userType);
			else
				binGroupCodeList = BinGroupEnumWoFOC.issueBin(userType);

		} else if (binRequestType.equals(BinRequestType.RECEIVE_BIN.toString())) {
			binGroupCodeList = BinGroupEnum.receiveBin(userType);

		}
		return binGroupCodeList;

	}

}
