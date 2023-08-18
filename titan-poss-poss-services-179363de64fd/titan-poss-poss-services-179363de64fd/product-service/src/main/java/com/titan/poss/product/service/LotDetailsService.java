/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.LotDetailsReqDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.LotNumberDetailReqDto;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dto.LotDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LotDetailsService {

	LotDetailsDto getLotDetailsService(LotDetailsReqDto lotDetailsReq);
	
	void updateLotDetailsService(LotNumberDetailReqDto lotNumberDetailReqDto);
	
	void updateCutPieceLotDetailsService(LotDto lotNumberDetailReqDto);
	
	List<LotDetailsDao> getLotDetailsList(List<LotDto> lotDtoList);

}
