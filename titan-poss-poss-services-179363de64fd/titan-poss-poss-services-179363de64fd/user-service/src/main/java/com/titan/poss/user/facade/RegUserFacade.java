package com.titan.poss.user.facade;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.response.ListResponse;

/**
 * Facade layer of regional role controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface RegUserFacade {
	public List<EmployeeLocationDto> listLocationMapping();


}
