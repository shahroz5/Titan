package com.titan.poss.payment.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BaseEmployeePaymentConfigDto;
import com.titan.poss.core.dto.EmployeeLoanConfirmRequestDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.EmployeeLocationMappingDao;
import com.titan.poss.payment.dao.EmployeePaymentConfigDao;
import com.titan.poss.payment.dao.EmployeeProductMappingDao;
import com.titan.poss.payment.repository.EmployeeLocationMappingRepository;
import com.titan.poss.payment.repository.EmployeeProductMappingRepository;
import com.titan.poss.payment.repository.PaymentMasterRepository;
import com.titan.poss.payment.service.EmployeeLoanConfigService;

@Service("EmployeeLoanServiceImpl")
public class EmployeeLoanServiceImpl implements EmployeeLoanConfigService {

	@Autowired
	PaymentMasterRepository employeeLoanRepository;

	@Autowired
	EmployeeLocationMappingRepository employeeLocationMappingRepo;

	@Autowired
	EmployeeProductMappingRepository employeeProductMappingRepository;
	
	private static final String EMPLOYEERECORDNOTFOUND = "This Employee Code record is not found.";
	private static final String ERR_ENG_033 = "ERR-ENG-033";
	private static final String EMPCODENOTFOUND = "The Selected Employee Code is not available to get loan for current location.";
	private static final String ERR_ENG_032 = "ERR-ENG-032";
	
	
	@Override
	public PagedRestResponse<List<BaseEmployeePaymentConfigDto>> getEmployeeConfigDetails(Pageable pageable) {
		Page<EmployeePaymentConfigDao> employeeList = employeeLoanRepository.findAll(pageable);
		List<BaseEmployeePaymentConfigDto> employeeDetailsDtoList = new ArrayList<>();

		employeeList.forEach(employeeDetails -> {
			EmployeePaymentDtoExt employeeDetailsDto = (EmployeePaymentDtoExt) MapperUtil
					.getObjectMapping(employeeDetails, new EmployeePaymentDtoExt());

			List<EmployeeLocationMappingDao> employeeLocationMappingDao = employeeLocationMappingRepo
					.findByEmployeePaymentConfig(employeeDetails);

			if (employeeLocationMappingDao != null) {

				List<EmployeeProductMappingDao> employeeProductMappingDao = employeeProductMappingRepository
						.findByEmployeeID(employeeDetails);

				if (employeeProductMappingDao != null && employeeProductMappingDao.size() > 0) {
					List<String> cfaCodes = new ArrayList<String>();
					for (EmployeeProductMappingDao productGroups : employeeProductMappingDao) {
						cfaCodes.add(productGroups.getProductGroupCode());
					}
					employeeDetailsDto.setProductGroupCodes(cfaCodes);
				}
				List<String> locationCodesList = new ArrayList<String>();
				employeeLocationMappingDao.forEach(locationCode -> {
					locationCodesList.add(locationCode.getLocationCode());
					employeeDetailsDto.setLocationCode(locationCodesList);
					employeeDetailsDto.setLoanConfigDetails(locationCode.getLoanConfigDetails());
				});

			}
			employeeDetailsDtoList.add(employeeDetailsDto);
		});
		return new PagedRestResponse<>(employeeDetailsDtoList, employeeList);
	}

	@Override
	public EmployeePaymentDtoExt updateEmployeeLoanDetails(
			EmployeeLoanConfirmRequestDto employeeLoanConfirmRequestDto) {

		Optional<EmployeePaymentConfigDao> employeePaymentConfigDao = employeeLoanRepository
				.findById(employeeLoanConfirmRequestDto.getId());
		if (employeePaymentConfigDao != null) {
			employeePaymentConfigDao.get().setRedeemedAmount(employeeLoanConfirmRequestDto.getRedeemedAmount());
			employeePaymentConfigDao.get().setStatus(employeeLoanConfirmRequestDto.getStatus());
			EmployeePaymentConfigDao empData = employeeLoanRepository.save(employeePaymentConfigDao.get());
			return (EmployeePaymentDtoExt) MapperUtil.getObjectMapping(empData, new EmployeePaymentDtoExt());
		} else {
			throw new ServiceException(EMPLOYEERECORDNOTFOUND, ERR_ENG_033);
		}
	}

	@Override
	public void deleteEmployeeLoanDetails(String employeeId) {
		Optional<EmployeePaymentConfigDao> employeePaymentConfigDao = employeeLoanRepository.findById(employeeId);

		if (employeePaymentConfigDao.isPresent()) {
			List<EmployeeProductMappingDao> employeeProductMappingDao = employeeProductMappingRepository
					.findByEmployeeID(employeePaymentConfigDao.get());
			List<EmployeeLocationMappingDao> employeeLocationMappingDao = employeeLocationMappingRepo
					.findByEmployeePaymentConfig(employeePaymentConfigDao.get());

			if (employeeProductMappingDao != null) {
				employeeProductMappingRepository.deleteAll(employeeProductMappingDao);
			}

			if (employeeLocationMappingDao != null) {
				employeeLocationMappingRepo.deleteAll(employeeLocationMappingDao);
			}

			employeeLoanRepository.delete(employeePaymentConfigDao.get());
		} else {
			throw new ServiceException(EMPLOYEERECORDNOTFOUND, ERR_ENG_033);
		}

	}
	
	@Override
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode,String buissnessDate,String locationCode) {
		EmployeePaymentDtoExt employeePaymentConfigDto = null;
		List<String> cfaCodes = new ArrayList<String>();
		List<String> locationCodesList = new ArrayList<String>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = null;
		try {
			date = sdf.parse(buissnessDate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		EmployeePaymentConfigDao employeePaymentDao = employeeLoanRepository.getEmployeeDetails(employeeCode,
				CalendarUtils.getStartOfDay(date));
		if (employeePaymentDao != null) {

			EmployeeLocationMappingDao employeeLocationMappingDao = employeeLocationMappingRepo
					.findByLocCodeAndEmployeeId(locationCode, employeePaymentDao);

			if (employeeLocationMappingDao != null) {

				List<EmployeeProductMappingDao> employeeProductMappingDao = employeeProductMappingRepository
						.findByEmployeeID(employeePaymentDao);
				employeePaymentConfigDto = (EmployeePaymentDtoExt) MapperUtil.getDtoMapping(employeePaymentDao,
						EmployeePaymentDtoExt.class);

				if (employeeProductMappingDao != null && employeeProductMappingDao.size() > 0) {
					for (EmployeeProductMappingDao productGroups : employeeProductMappingDao) {
						cfaCodes.add(productGroups.getProductGroupCode());
					}
				}

				employeePaymentConfigDto.setProductGroupCodes(cfaCodes);
				locationCodesList.add(locationCode);
				employeePaymentConfigDto.setLocationCode(locationCodesList);
				employeePaymentConfigDto.setIsEmployeeConfiguredAtEposs(true);
				employeePaymentConfigDto.setLoanConfigDetails(employeeLocationMappingDao.getLoanConfigDetails());

				return employeePaymentConfigDto;
			} else {
				throw new ServiceException(EMPCODENOTFOUND, ERR_ENG_032);
			}

		} 
		else {
			throw new ServiceException(EMPLOYEERECORDNOTFOUND, ERR_ENG_033);
		}
	}
}
