/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.BinRequestDao;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.BinRequestEnum;
import com.titan.poss.inventory.dto.request.BinRequestCreateDto;
import com.titan.poss.inventory.dto.request.HistoryRequestBinDto;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.repository.BinRequestRepository;
import com.titan.poss.inventory.service.BinRequestService;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDocMasterService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("binRequestService")
public class BinRequestServiceImpl implements BinRequestService {

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	private BinRequestRepository binRequestRepository;

	@Autowired
	private EngineService engineService;

	@Override
	public Long getRequestCountByStatus(List<String> status) {

		return binRequestRepository.countByStatusIn(status);
	}

	@Override
	@Transactional
	public BinRequestDto createBinRequest(BinRequestCreateDto binRequestCreate) {
		BinRequestDao binReq = binRequestRepository.findOneByBinNameAndStatusIn(binRequestCreate.getBin(),
				List.of(BinRequestEnum.APVL_PENDING.toString(), BinRequestEnum.APPROVED.toString()));
		if (binReq != null) {
			throw new ServiceException("Requested Bin name already exists", "ERR-INV-031");
		}
		CountryDetailsDto countryDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		BinRequestDao binRequest = new BinRequestDao();
		binRequest.setBinName(binRequestCreate.getBin());
		binRequest.setRequestedRemarks(binRequestCreate.getRemarks());
		binRequest.setReqDocDate(businessDayDto.getBusinessDate());
		binRequest.setReqFiscalYear(countryDto.getFiscalYear().shortValue());
		binRequest.setStatus(BinRequestEnum.APVL_PENDING.toString());
		binRequest.setRequestedRemarks(binRequestCreate.getRemarks());
		binRequest.setReqLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		binRequest.setReqDocNo(inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.BINREQUEST.toString()));
		if (CustomSecurityPrincipal.getSecurityPrincipal().getLocType().equals(UserTypeEnum.L1.toString())
				|| CustomSecurityPrincipal.getSecurityPrincipal().getLocType().equals(UserTypeEnum.L2.toString())) {
			binRequest.setBinGroupCode(BinGroupEnum.STN.toString());
		}
		if (CustomSecurityPrincipal.getSecurityPrincipal().getLocType().equals(UserTypeEnum.L3.toString())) {
			binRequest.setBinGroupCode(BinGroupEnum.PURCFA.toString());
		}
		return (BinRequestDto) MapperUtil.getDtoMapping(binRequestRepository.save(binRequest), BinRequestDto.class);
	}

	@Override
	public Page<BinRequestDao> findAllBinRequestsByCriteria(Example<BinRequestDao> criteria, Pageable pageable) {
		return binRequestRepository.findAll(criteria, pageable);
	}

	@Override
	public Optional<BinRequestDao> findById(Integer id) {
		return binRequestRepository.findById(id);
	}

	@Override
	public BinRequestDao save(BinRequestDao binRequest) {
		return binRequestRepository.save(binRequest);
	}

	@Override
	public Page<BinRequestDao> listBinRequestHistory(String locationCode, Date startingDate, Date endingDate,
			List<String> statuses, HistoryRequestBinDto historyRequestBinDto, Pageable pageable) {
		return binRequestRepository.listBinRequestHistory(historyRequestBinDto.getReqDocNo(),
				historyRequestBinDto.getReqFiscalYear(), historyRequestBinDto.getBinName(),
				historyRequestBinDto.getBinGroupCode(), statuses, startingDate, endingDate, locationCode, pageable);
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

}
