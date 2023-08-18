package com.titan.poss.user.facade.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.user.dao.EmployeeLocationMappingDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.facade.RegUserFacade;
import com.titan.poss.user.repository.EmployeeLocationMappingRepository;
import com.titan.poss.user.repository.EmployeeRoleMappingRepositoryExt;
import com.titan.poss.user.repository.RoleRepositoryExt;
/**
 * Facade implementation layer of corporate user controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
@Service
public class RegUserFacadeImpl implements RegUserFacade {

	
	@Autowired
	EmployeeLocationMappingRepository employeeLocationMappingRepository;

	@Autowired
	RoleRepositoryExt roleRepository;
	
	@Autowired
	EmployeeRoleMappingRepositoryExt employeeRoleMappingRepository;
	
	@Override
	public List<EmployeeLocationDto> listLocationMapping(){
		//EmployeeDao emp = getEmployeeDetailsWithErrorCheck(CommonUtil.getUserName());
		List<EmployeeRoleMappingDaoExt> employee = employeeRoleMappingRepository.findByEmployeeEmployeeCode(CommonUtil.getUserName());
		RoleDao role = roleRepository.findOneByRoleCode(employee.get(0).getRole().getRoleCode());
		List<EmployeeLocationDto> employeeLocDtoList=new ArrayList<>();
		if(role.getIsLocationMappingRequired()!=null && role.getIsLocationMappingRequired().equals(Boolean.TRUE)) {
			List<EmployeeLocationMappingDao> employeeMappingAll =employeeLocationMappingRepository.findByEmployeeEmployeeCode(CommonUtil.getUserName());
			for (EmployeeLocationMappingDao location : employeeMappingAll) {
				EmployeeLocationDto employeeLocationDto = new EmployeeLocationDto();
				employeeLocationDto.setId(location.getId());
				employeeLocationDto.setEmployeeCode(CommonUtil.getUserName());
				employeeLocationDto.setLocationCode(location.getLocationCode());
				employeeLocDtoList.add(employeeLocationDto);
			}	
		}
			
		 return  (employeeLocDtoList);
		
	}
}
