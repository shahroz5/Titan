package com.titan.poss.file.jobs.writer;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.core.dto.EmployeeLoanConfigDetailsDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.EmployeeDetailsDto;
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;
import com.titan.poss.payment.dao.EmployeeLocationMappingDao;
import com.titan.poss.payment.dao.EmployeePaymentConfigDao;
import com.titan.poss.payment.dao.EmployeeProductMappingDao;
import com.titan.poss.payment.repository.EmployeeLocationMappingRepository;
import com.titan.poss.payment.repository.EmployeeProductMappingRepository;
import com.titan.poss.payment.repository.PaymentMasterRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class EmployeeLoanConfigIngestionWriter implements ItemWriter<EmployeeLoanConfigWriterDto> {

	@Autowired
	private EmployeeLoanConfigJobWriter employeeLoanConfigWriter;

	@Autowired
	private DataSource dataSource;

	@Autowired
	PaymentMasterRepository paymentMasterRepository;

	@Autowired
	EmployeeLocationMappingRepository employeeLocationMappingRepo;

	@Autowired
	EmployeeProductMappingRepository employeeProductMappingRepo;

	@Override
	public void write(List<? extends EmployeeLoanConfigWriterDto> items) throws Exception {
		List<EmployeePaymentConfigDao> empPaymentDaoList = new ArrayList<>();
		List<EmployeeProductMappingDao> empProductGroupDaoList = new ArrayList<>();
		List<EmployeeLocationMappingDao> empLocationMappingDaoList = new ArrayList<>();
		EmployeePaymentConfigDao employeePaymentConfigDao = null;
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		for (EmployeeLoanConfigWriterDto empConfigDto : items) {
			if (empConfigDto != null) {

				//Find all the records from employee_payment_config table.
				employeePaymentConfigDao = paymentMasterRepository
						.findAllEmployeeDetails(empConfigDto.getEmployeeCode());

				//If the record available, update them or insert new record.
				if (employeePaymentConfigDao != null) {
					employeePaymentConfigDao.setApprovalDate(empConfigDto.getApprovalDate());
					employeePaymentConfigDao.setEligibleAmount(empConfigDto.getAmountEligibility());
					EmployeeDetailsDto employeeDetails = new EmployeeDetailsDto();
					employeeDetails.setMobileNumber(empConfigDto.getMobileNo());
					employeeDetails.setEmployeeName(empConfigDto.getEmployeeName());
					employeePaymentConfigDao.setEmployeeDetails(MapperUtil.getJsonString(employeeDetails));
					employeePaymentConfigDao.setEmployeeCode(empConfigDto.getEmployeeCode());
					employeePaymentConfigDao.setValidityDate(empConfigDto.getValidaityDate());
					employeePaymentConfigDao.setCorrelationId(empConfigDto.getFileAuditId());
				} else {
					employeePaymentConfigDao = new EmployeePaymentConfigDao();
					employeePaymentConfigDao.setApprovalDate(empConfigDto.getApprovalDate());
					employeePaymentConfigDao.setEligibleAmount(empConfigDto.getAmountEligibility());
					employeePaymentConfigDao.setEmployeeCode(empConfigDto.getEmployeeCode());
					EmployeeDetailsDto employeeDetails = new EmployeeDetailsDto();
					employeeDetails.setMobileNumber(empConfigDto.getMobileNo());
					employeeDetails.setEmployeeName(empConfigDto.getEmployeeName());
					employeePaymentConfigDao.setEmployeeDetails(MapperUtil.getJsonString(employeeDetails));
					employeePaymentConfigDao.setValidityDate(empConfigDto.getValidaityDate());
					employeePaymentConfigDao.setCreatedBy(empConfigDto.getCreatedBy());
					employeePaymentConfigDao.setCreatedDate(empConfigDto.getCreatedDate());
					employeePaymentConfigDao.setLastModifiedBy(empConfigDto.getLastModifiedBy());
					employeePaymentConfigDao.setLastModifiedDate(empConfigDto.getLastModifiedDate());
					employeePaymentConfigDao.setConfig_type("EMPLOYEE_LOAN");
					employeePaymentConfigDao.setRedeemedAmount(new BigDecimal(0));
					employeePaymentConfigDao.setStatus("OPEN");
					employeePaymentConfigDao.setCorrelationId(empConfigDto.getFileAuditId());
					empPaymentDaoList.add(employeePaymentConfigDao);
				}

				//save the record in database
				employeePaymentConfigDao = paymentMasterRepository.save(employeePaymentConfigDao);

				//Split the product group with "," and add those records to employee_product_mapping table
				String[] productGrp = empConfigDto.getProductGrpCodes().trim().split(",");

				for (String products : productGrp) {

					EmployeeProductMappingDao employeeProductMappingDao = null;

					employeeProductMappingDao = employeeProductMappingRepo
							.findByEmployeeIdAndProductGroupCode(employeePaymentConfigDao, products);

					if (employeeProductMappingDao == null) {
						employeeProductMappingDao = new EmployeeProductMappingDao();
						employeeProductMappingDao.setProductGroupCode(products);
						employeeProductMappingDao.setEmployeePaymentConfig(employeePaymentConfigDao);
						employeeProductMappingDao.setCreatedBy(empConfigDto.getCreatedBy());
						employeeProductMappingDao.setCreatedDate(empConfigDto.getCreatedDate());
						employeeProductMappingDao.setLastModifiedBy(empConfigDto.getLastModifiedBy());
						employeeProductMappingDao.setLastModifiedDate(empConfigDto.getLastModifiedDate());
						employeeProductMappingDao.setCorrelationId(empConfigDto.getFileAuditId());
						empProductGroupDaoList.add(employeeProductMappingDao);
					} else {
						employeeProductMappingDao.setProductGroupCode(products);
						employeeProductMappingDao.setEmployeePaymentConfig(employeePaymentConfigDao);
						employeeProductMappingDao.setCreatedBy(empConfigDto.getCreatedBy());
						employeeProductMappingDao.setCreatedDate(empConfigDto.getCreatedDate());
						employeeProductMappingDao.setLastModifiedBy(empConfigDto.getLastModifiedBy());
						employeeProductMappingDao.setLastModifiedDate(empConfigDto.getLastModifiedDate());
						employeeProductMappingDao.setCorrelationId(empConfigDto.getFileAuditId());
						employeeProductMappingRepo.save(employeeProductMappingDao);
					}
				}

				if (empProductGroupDaoList.size() > 0)
					employeeProductMappingRepo.saveAll(empProductGroupDaoList);

				//Split the product group with "," and add those records to employee_location_mapping table
				String[] locationCodes = empConfigDto.getLocationCodes().trim().split(",");

				for (String locationCode : locationCodes) {
					EmployeeLocationMappingDao employeeLocationMappingDao = null;
					employeeLocationMappingDao = employeeLocationMappingRepo
							.findByLocCodeAndEmployeeId(locationCode, employeePaymentConfigDao);

					if (employeeLocationMappingDao == null) {
						employeeLocationMappingDao = new EmployeeLocationMappingDao();
						employeeLocationMappingDao.setEmployeePaymentConfig(employeePaymentConfigDao);
						employeeLocationMappingDao.setLocationCode(locationCode);
						employeeLocationMappingDao.setCreatedBy(empConfigDto.getCreatedBy());
						employeeLocationMappingDao.setCreatedDate(empConfigDto.getCreatedDate());
						employeeLocationMappingDao.setLastModifiedBy(empConfigDto.getLastModifiedBy());
						employeeLocationMappingDao.setLastModifiedDate(empConfigDto.getLastModifiedDate());
						employeeLocationMappingDao.setCorrelationId(empConfigDto.getFileAuditId());
						EmployeeLoanConfigDetailsDto employeeLoanConfigDetailsDto = new EmployeeLoanConfigDetailsDto();
						employeeLoanConfigDetailsDto.setMargin(empConfigDto.getMargin());
						employeeLoanConfigDetailsDto.setOtpRequired(empConfigDto.getOtpRequired());
						employeeLoanConfigDetailsDto.setPartlyRedeemable(empConfigDto.getRedeemability());
						employeeLocationMappingDao.setLoanConfigDetails(MapperUtil.getJsonString(employeeLoanConfigDetailsDto));
						empLocationMappingDaoList.add(employeeLocationMappingDao);
					} else {
						employeeLocationMappingDao.setEmployeePaymentConfig(employeePaymentConfigDao);
						employeeLocationMappingDao.setLocationCode(locationCode);
						employeeLocationMappingDao.setCreatedBy(empConfigDto.getCreatedBy());
						employeeLocationMappingDao.setCreatedDate(empConfigDto.getCreatedDate());
						employeeLocationMappingDao.setLastModifiedBy(empConfigDto.getLastModifiedBy());
						employeeLocationMappingDao.setLastModifiedDate(empConfigDto.getLastModifiedDate());
						employeeLocationMappingDao.setCorrelationId(empConfigDto.getFileAuditId());
						EmployeeLoanConfigDetailsDto employeeLoanConfigDetailsDto = new EmployeeLoanConfigDetailsDto();
						employeeLoanConfigDetailsDto.setMargin(empConfigDto.getMargin());
						employeeLoanConfigDetailsDto.setOtpRequired(empConfigDto.getOtpRequired());
						employeeLoanConfigDetailsDto.setPartlyRedeemable(empConfigDto.getRedeemability());
						employeeLocationMappingDao.setLoanConfigDetails(MapperUtil.getJsonString(employeeLoanConfigDetailsDto));
						employeeLocationMappingRepo.save(employeeLocationMappingDao);
					}
				}
				if (empLocationMappingDaoList.size() > 0)
					employeeLocationMappingRepo.saveAll(empLocationMappingDaoList);
			}
		}


//		employeeLoanConfigWriter.employeeLoanConfigPaymentIngestionWriter(dataSource).write(empPaymentDaoList);
//		employeeLoanConfigWriter.employeeLoanConfigProductIngestionWriter(dataSource).write(empProductGroupDaoList);
//		employeeLoanConfigWriter.employeeLoanConfigLocationIngestionWriter(dataSource).write(empLocationMappingDaoList);

	}

}
