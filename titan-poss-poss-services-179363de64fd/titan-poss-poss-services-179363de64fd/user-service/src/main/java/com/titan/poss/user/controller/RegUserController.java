package com.titan.poss.user.controller;

import java.util.List;

//import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_REG_USER;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.user.facade.RegUserFacade;

import io.swagger.annotations.ApiOperation;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/reg/users")
//@PreAuthorize(IS_REG_USER)
public class RegUserController {
	
	@Autowired
	private RegUserFacade regUserFacade;
	
	/**
	 * This method will return the list of Employee Location mapping details based
	 * on isActive.
	 * 
	 * @param employeeCode
	 * @param isActive
	 * @return ListResponse<EmployeeLocationDto>
	 */
	@ApiOperation(value = "API to get the list of Employee Location mapping of Area Business Role details for a given employeeCode ", notes = "This API returns the list of Employee location mapping details based on employeeCode")
	@GetMapping("/employeeCode/location")
	//@PreAuthorize(USER_VIEW_PERMISSION)
	public List<EmployeeLocationDto> listLocationMapping() {
		return regUserFacade.listLocationMapping();
	}
	

}
