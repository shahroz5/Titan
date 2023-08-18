/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.UserLovDao;
import com.titan.poss.user.dto.KeyValueDto;
import com.titan.poss.user.dto.response.LovDto;
import com.titan.poss.user.repository.UserLovRepository;
import com.titan.poss.user.service.UserLovService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserLovService")
public class UserLovServiceImpl implements UserLovService {

	@Autowired
	private UserLovRepository userLovRepository;

	/**
	 * This method will return the LOV details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@Override
	public LovDto getLov(String lovType, Boolean isActive) {

		List<UserLovDao> userLovList = userLovRepository.findByLovTypeOrderByOrdersAsc(lovType);

		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);

		if (!userLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = new ArrayList<>();
			userLovList.forEach(userLov -> {
				if (isActive == null || (isActive != null && userLov.getIsActive().equals(isActive)))
					keyValueDtoList.add((KeyValueDto) MapperUtil.getObjectMapping(userLov, new KeyValueDto()));
			});
			lovDto.setResults(keyValueDtoList);
		}

		return lovDto;
	}

}
