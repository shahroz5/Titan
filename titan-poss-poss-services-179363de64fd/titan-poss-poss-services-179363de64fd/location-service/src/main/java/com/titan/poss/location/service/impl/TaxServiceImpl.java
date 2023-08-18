/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.TaxDao;
import com.titan.poss.location.dto.TaxDto;
import com.titan.poss.location.dto.request.TaxUpdateDto;
import com.titan.poss.location.repository.TaxRepository;
import com.titan.poss.location.service.TaxService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("taxService")
public class TaxServiceImpl implements TaxService {

	private static final String ERR_LOC_007 = "ERR-LOC-007";

	private static final String NO_TAX_DETAILS_FOUND_FOR_THE_REQUESTED_TAX_CODE = "No Tax details found for the requested taxCode";

	@Autowired
	private TaxRepository taxRepository;

	/**
	 * This method will return the list of Tax details based on the isActive.
	 *
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List < TaxDto>>
	 */
	@Override
	public PagedRestResponse<List<TaxDto>> listTax(Boolean isActive, Pageable pageable, String taxSystem) {

		TaxDao taxDaoCriteria = new TaxDao();
		taxDaoCriteria.setIsActive(isActive);
		taxDaoCriteria.setTaxSystem(taxSystem);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<TaxDao> criteria = Example.of(taxDaoCriteria, matcher);

		Page<TaxDao> taxList = taxRepository.findAll(criteria, pageable);

		List<TaxDto> taxDtoList = new ArrayList<>();
		taxList.forEach(tax -> taxDtoList.add((TaxDto) MapperUtil.getDtoMapping(tax, TaxDto.class)));
		return (new PagedRestResponse<>(taxDtoList, taxList));
	}

	/**
	 * This method will return the Tax details based on the taxCode.
	 *
	 * @param taxCode
	 * @return TaxDto
	 */
	@Override
	public TaxDto getTax(String taxCode) {
		TaxDao tax = taxRepository.findOneByTaxCode(taxCode);
		if (tax == null)
			throw new ServiceException(NO_TAX_DETAILS_FOUND_FOR_THE_REQUESTED_TAX_CODE, ERR_LOC_007);
		return (TaxDto) MapperUtil.getDtoMapping(tax, TaxDto.class);
	}

	/**
	 * This method will save the Tax details.
	 *
	 * @param taxDto
	 * @return TaxDto
	 */
	@Override
	@Transactional
	public TaxDto addTax(TaxDto taxDto) {
		TaxDao tax = (TaxDao) MapperUtil.getDtoMapping(taxDto, TaxDao.class);
		taxRepository.save(tax);
		return taxDto;
	}

	/**
	 * This method will update the Tax details.
	 *
	 * @param taxCode
	 * @param taxUpdateDto
	 * @return TaxDto
	 */
	@Override
	@Transactional
	public TaxDto updateTax(String taxCode, TaxUpdateDto taxUpdateDto) {
		TaxDao tax = taxRepository.findOneByTaxCode(taxCode);
		if (tax == null)
			throw new ServiceException(NO_TAX_DETAILS_FOUND_FOR_THE_REQUESTED_TAX_CODE, ERR_LOC_007);
		tax = (TaxDao) MapperUtil.getObjectMapping(taxUpdateDto, tax);
		taxRepository.save(tax);
		return (TaxDto) MapperUtil.getObjectMapping(tax, new TaxDto());
	}
}
