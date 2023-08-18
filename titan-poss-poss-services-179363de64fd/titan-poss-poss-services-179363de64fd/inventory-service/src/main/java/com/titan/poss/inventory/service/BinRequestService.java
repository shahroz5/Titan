/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.inventory.dao.BinRequestDao;
import com.titan.poss.inventory.dto.request.BinRequestCreateDto;
import com.titan.poss.inventory.dto.request.HistoryRequestBinDto;
import com.titan.poss.inventory.dto.response.BinRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface BinRequestService {

	Long getRequestCountByStatus(List<String> status);

	BinRequestDto createBinRequest(BinRequestCreateDto binRequestDto);

	Page<BinRequestDao> findAllBinRequestsByCriteria(Example<BinRequestDao> criteria, Pageable pageable);

	Optional<BinRequestDao> findById(Integer id);

	BinRequestDao save(BinRequestDao binRequest);

	// bin creation request history method
	Page<BinRequestDao> listBinRequestHistory(String locationCode, Date startingDate, Date endingDate,
			List<String> statuses, HistoryRequestBinDto historyRequestBinDto, Pageable pageable);

}
