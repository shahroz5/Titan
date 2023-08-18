/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.LotDetailsReqDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.LotNumberDetailReqDto;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dto.LotDetailsDto;
import com.titan.poss.product.service.LotDetailsService;

import io.swagger.annotations.ApiOperation;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("LotDataController")
@RequestMapping("product/v2/lot-details")
public class LotController {
	
	
	
	@Autowired
	private LotDetailsService lotDetails;
	
	/**
	 * This method will return the list of Stone and material details
	 *
	 * @param lotDetailsReq
	 * @return LotDetailsDto
	 */
	@ApiOperation(value = "View the list of Stone and Material details", notes = "This API returns the list of Stone details and Material details based on **lotNumber** and **itemCode**")
	@PostMapping
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public LotDetailsDto getLotDetails(@RequestBody(required = true) LotDetailsReqDto lotDetailsReq) {
		return lotDetails.getLotDetailsService(lotDetailsReq);
	}
	
	@PostMapping("/items/lotDto")
	public List<LotDetailsDao> getItemsWithItemCodeAndLotNumber(@RequestBody(required = true) List<LotDto> lotDtoList) {
		return lotDetails.getLotDetailsList(lotDtoList);
	}
	
	@ApiOperation(value = "Save the list of Stone and Material details", notes = "This API updates the list of Stone details and Material details")
	@PutMapping("/update-lot-details")
	public void updateLotStoneDetails(
			@RequestBody(required= true) LotNumberDetailReqDto lotNumberDetailReqDto){
		 lotDetails.updateLotDetailsService(lotNumberDetailReqDto);
	}
	
	@ApiOperation(value = "Save the list of Stone and Material details", notes = "This API updates the list of Stone details and Material details")
	@PutMapping("/update-cut-piece-lot-details")
	public void updateCutPieceLotStoneDetails(
			@RequestBody(required= true) LotDto lotNumberDetailReqDto){
		 lotDetails.updateCutPieceLotDetailsService(lotNumberDetailReqDto);
	}	
	
}
