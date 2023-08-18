/* delete data from all tables*/

DELETE FROM user_session;
DELETE FROM user_otp_retry;
DELETE FROM user_otp;
DELETE FROM user_login_aud;
DELETE FROM user_login;
DELETE FROM employee_role_mapping_aud;
DELETE FROM employee_role_mapping;
DELETE FROM employee_master_aud;
DELETE FROM employee_master;
DELETE FROM location_role_config_aud;
DELETE FROM location_role_config;
DELETE FROM role_acl_mapping_aud;
DELETE FROM role_acl_mapping;
DELETE FROM role_limit_request_details;
DELETE FROM role_limit_request;
DELETE FROM user_doc_master;
DELETE FROM role_master_aud;
DELETE FROM role_master;
DELETE FROM acl_master_aud;
DELETE FROM acl_master;
DELETE FROM acl_group_master;
DELETE FROM user_lov_master;



/* set id auto-generation to 1*/
DBCC CHECKIDENT (role_limit_request, RESEED, 0); 



/* insert into user_lov_master*/

insert into user_lov_master (id, lov_type, code, value, is_active, created_by, created_date, last_modified_by, last_modified_date) values
	(NEWID(), 'ROLE_TYPE', 'CORP', 'Corporate', 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	(NEWID(), 'ROLE_TYPE', 'BTQ', 'Boutique', 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	(NEWID(), 'ROLE_TYPE', 'REG', 'Regional', 1, 'rajani', GETDATE(), 'rajani', GETDATE());	



/*insert into acl_group_master*/

insert into acl_group_master (acl_group_code, description, parent_acl_group_code, is_leaf, is_corp_can_access, created_by, created_date, last_modified_by, last_modified_date) values
	('I', 'Inventory Management', NULL, 0, NULL, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('I0', 'Receive Stock', 'I', 1, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('I1', 'In stock Management', 'I', 1, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('I2', 'Issue Stock', 'I', 1, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('I3', 'Approval', 'I', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('I4', 'Stock File Upload', 'I', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('L', 'Location Management', NULL, 1, NULL, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('P', 'Product Management', NULL, 1, NULL, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('U', 'User Access Management', NULL, 1, NULL, 'rajani', GETDATE(), 'rajani', GETDATE());
	


/*insert into acl_master*/

insert into acl_master (acl_code, description, acl_group, sub_acl_group, is_active, created_by, created_date, last_modified_by, last_modified_date, is_corp_can_access) values
	('A0', 'Admin approve role limit request', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('A1', 'Admin View role limit request', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('I0', 'Receive - From Factory', 'I0', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('I1', 'Receive - From CFA', 'I0', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('I4', 'IBT - requests sent', 'I1', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('I6', 'Conversion - Search by variant', 'I1', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('I9', 'Other receipts - Loan', 'I1', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('I11', 'Other receipts - PSV', 'I1', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('I30', 'Approve - Conversion Requests', 'I3', 'inv', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('M1', 'product masters brand add edit', 'P', 'mas', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('M10', 'product masters product category add edit', 'P', 'mas', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('M65', 'location hierarchy market code add edit', 'L', 'mas', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('M66', 'location hierarchy market code view', 'L', 'mas', 0, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('M67', 'location hierarchy location add edit', 'L', 'mas', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('M72', 'location hierarchy region view', 'L', 'mas', 0, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('M74', 'location hierarchy sub region view', 'L', 'mas', 0, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('U0', 'view users', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('U1', 'add edit users', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('U2', 'view roles', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('U3', 'add edit roles', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('U4', 'generate OTP', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('U5', 'update role limit', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1),
	('U6', 'create role limit request', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 0),
	('U7', 'view role limit request', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), NULL),
	('U8', 'approve role limit request', 'U', 'UAM', 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 1);
	
	

/*insert into role_master*/

insert into role_master (role_code, description, role_name, role_type, corp_access, is_active, created_by, created_date, last_modified_by, last_modified_date) values
	('ADMIN', 'System Admin', 'System Admin', 'CORP', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('BOS', 'Boutique Operations Specialist in Tanishq Jewellers', 'Boutique Operations Specialist', 'BTQ', 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('CASHIER', 'Cashier', 'Cashier', 'BTQ', 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('COMMERCIAL', 'Commercial Team', 'Commercial Team', 'CORP', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('PRICING', 'Pricing Team', 'Pricing Team', 'CORP', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('REG_TEST_ROLE', 'Testing regional role creation', 'Regional Testing Role', 'REG', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('SM', 'Store Manager', 'Store Manager', 'BTQ', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('RSO', 'Retail Sales Officer', 'Retail Sales Officer', 'BTQ', 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('FINANCE', 'Finance', 'Finance', 'CORP', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),	
	('FINANCE2', 'Finance2', 'Finance2', 'CORP', 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),	
	('KARIGAR', 'Karigar', 'Karigar', 'BTQ', 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('UNITTEST', 'Unit Test Role Code', 'UnitTest', 'BTQ', 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('HOUSEKEEPING', 'House Keeping', 'House Keeping', 'BTQ', 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('MERCHANDISE', 'Merchandise', 'merchandise', 'CORP', 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('UNITTEST2', 'UnitTest2', 'UnitTest2', 'BTQ', 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE());
	


/*insert into role_acl_mapping*/

insert into role_acl_mapping (role_code, acl_code, created_by, created_date, last_modified_by, last_modified_date) values
	('BOS', 'U1',	'rajani', 	GETDATE(),	'rajani', 	GETDATE()),
	('BOS',	'I0',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('BOS',	'I1',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('BOS', 'I4',	'rajani', 	GETDATE(),	'rajani', 	GETDATE()),
	('COMMERCIAL',	'M1',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('COMMERCIAL',	'M10',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('COMMERCIAL',	'M66',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('COMMERCIAL',	'M65',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('COMMERCIAL' ,	'M67',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'A0',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'A1',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U0',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U1',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U2',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U3',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U4',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U5',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U7',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN',	'U8',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN' ,	'M72',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ADMIN' ,	'M74',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SM',	'U0',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SM',	'U1',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SM',	'U2',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SM',	'U4',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SM',	'U6',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SM',	'U7',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('PRICING',	'I30',	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('RSO' ,	'U1',	'rajani', GETDATE(),	'rajani', GETDATE());	
	
	

/*insert into location_role_config*/
	
insert into location_role_config (location_code, role_code, user_limit, assigned_users, is_default, is_active, created_by, created_date, last_modified_by, last_modified_date) values
	('LF',	'BOS',	4,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('LF',	'SM',	1,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('LF',	'RSO',	3,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('LF',	'KARIGAR',	2,	0,	1,	0,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('LF',	'HouseKeeping',	3,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('MF',	'BOS',	6,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('MF',	'SM',	2,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('SF',	'SM',	2,	0,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('MICF',	'SM',	2,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('MICF',	'BOS',	2,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('TF',	'HouseKeeping',	3,	0,	1,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ABO',	'SM',	2,	1,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ABO',	'CASHIER',	2,	0,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('PNA',	'BOS',	2,	1,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('PNA',	'SM',	2,	1,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('KHN',	'SM',	6,	4,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('KHN',	'CASHIER',	7,	4,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('KHN',	'BOS',	8,	4,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('KHN',	'RSO',	3,	1,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('KHN',	'KARIGAR',	2,	0,	0,	0,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('ABO',	'BOS',	6,	2,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('U59',	'SM',	4,	3,	0,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('U59', 'CASHIER', 4, 0, 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('BOR', 'SM', 2, 0, 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE());
	

	
/*insert into employee_master*/

insert into employee_master (employee_code, emp_name, address, birth_date, joining_date, resignation_date, email_id, mobile_no, location_code, region_code, org_code, user_type, force_password_change, has_login_access, is_active, created_by, created_date, last_modified_by, last_modified_date, employee_type) values
	('admin', 'System admin', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'admin@mindtree.com', '8608455812', NULL, NULL, 'TJ', 'ORG',  0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('arnab', 'arnab layek', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'arnabg1@mindtree.com', '9988997899', NULL, NULL, 'TJ', 'ORG',  0, 1, 0, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('arnab02', 'arnab two', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', NULL, GETDATE(), NULL, 'arnab02@titan.com', '9115671402', NULL, NULL, 'TJ', 'ORG',  1, 1, 1,'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('bos.abo', 'ABO User', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', NULL, GETDATE(), NULL, 'bos.abo@mindtree.com', '8608455847', 'ABO', NULL, 'TJ', 'L2',  0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('Gita', 'Gita', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'Gita@mindtree.com', '6616880003', 'PNA', NULL, 'TJ', 'L3',  1, 1, 0, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('gwen', 'gwen', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'gwen.tennyson@mindtree.com', '8899663322', 'KHN', NULL, 'TJ', 'L3',  0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('hun', 'hun', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'hun@titan.co.in', '8090980909', 'KHN', NULL, 'TJ', 'L3', 1, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('len', 'len', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'len.boss12@mindtree.com', '7890653218', 'HNR', NULL, 'TJ', 'L2', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('ptif', 'ptif', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'ptif@titan.com', '9763027271', 'KHN', NULL, 'TJ', 'L3', 1, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('sm.abo', 'ABO SM', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'sm.abo@mindtree.com', '8608455832', 'ABO', NULL, 'TJ', 'L2', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('sm.kdh', 'KDH SM', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', NULL, GETDATE(), NULL, 'sm.kdh@mindtree.com', '86068455835', 'KDH', NULL, 'TJ', 'L3', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('sm.khn', 'KHN SM', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', NULL, GETDATE(), NULL, 'sm.khn@mindtree.com', '8877165541', 'KHN', NULL, 'TJ', 'L3', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('ten', 'ten', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'ten@mindtree.com', '9900554421', 'KHN', NULL, 'TJ', 'L3', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('UTcb99', 'UTcb NN', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'Utcb99@titan.com', '9244979369', NULL, NULL, 'TJ', 'ORG', 1, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('yen', 'bos.khn', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'vrxq@mindtree.com', '7777089213', 'KHN', NULL, 'TJ', 'L3', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('bos.khn', 'bos.khn', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'bos.khn@mindtree.com', '7777089223', 'KHN', NULL, 'TJ', 'L3', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('UTod20', 'UTod two', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'UTod20@titan.com', '8608455840', NULL, NULL, 'TJ', 'ORG', 1, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('Yuzuriha', 'Yuzuriha', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'Yuzuriha@mindtree.com', '6777180004', NULL, 'WEST', 'TJ', 'REG', 1, 1, 0, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('commercial', 'commercial user', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '1996-11-26 00:00:00.000', GETDATE(), NULL, 'commercial@mindtree.com', '8608455836', NULL, NULL, 'TJ', 'ORG', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('commercial1', 'commercial user', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '1996-11-26 00:00:00.000', GETDATE(), NULL, 'commercial@mindtree.com', '8608455836', NULL, NULL, 'TJ', 'ORG', 0, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('Harry', 'Harry', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), NULL, 'Harry@titan.com', '8608455040', NULL, NULL, 'TJ', 'ORG', 1, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT'),
	('TEMP.KHN.1', 'TEMP KHN One', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', '2020-01-27 16:30:41.853', NULL, 'TEMPKHN1@titan.com', '8118455040', 'KHN', NULL, 'TJ', 'L3', 1, 1, 1, 'rajani', '2020-01-27 16:30:41.853', 'rajani', '2020-01-27 16:30:41.853', 'TEMP'),
	('Barry', 'Barry', '{"type":"address","data":{"line1":"DS Max Silicon, RR Layout, RR Nagar, ","line2":"","city":"Bangalore","country":"India","pincode":"751024","state":"HARYANA"}}', '2019-11-26 00:00:00.000', GETDATE(), DATEADD(day, 1, GETDATE()), 'Barry@titan.com', '8608455010', NULL, NULL, 'TJ', 'ORG', 1, 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE(), 'PERMANENT');
	


	
/*insert into employee_role_mapping*/

insert into employee_role_mapping (employee_code, role_code, start_time, expiry_time, is_primary, created_by, created_date, last_modified_by, last_modified_date) values
	('admin', 'ADMIN', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('bos.abo', 'BOS', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('sm.abo', 'SM', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('sm.kdh', 'SM', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('sm.khn', 'SM', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('ten', 'BOS', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('ten', 'CASHIER', DATEADD(day, 1, GETDATE()), DATEADD(month, 1, GETDATE()), 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('gwen', 'BOS', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('len', 'SM', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('ptif', 'SM', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('yen', 'BOS', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('bos.khn', 'BOS', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('Utod20', 'ADMIN', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('arnab02', 'COMMERCIAL', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('UTcb99', 'COMMERCIAL', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('UTcb99', 'FINANCE', DATEADD(day, 1, GETDATE()), DATEADD(month, 1, GETDATE()), 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('hun', 'SM', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('Yuzuriha', 'REG_TEST_ROLE', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('commercial', 'COMMERCIAL', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('arnab02', 'FINANCE', '2020-01-27 15:57:41.853', GETDATE(), 0, 'rajani', '2020-01-27 15:57:41.853', 'rajani', GETDATE()),
	('Harry', 'PRICING', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('TEMP.KHN.1', 'CASHIER', NULL, NULL, 1, 'rajani', '2020-01-27 16:30:41.853', 'rajani', '2020-01-27 16:30:41.853'),
	('Barry', 'PRICING', NULL, NULL, 1, 'rajani', GETDATE(), 'rajani', GETDATE());
	
	
/* insert into user_login*/

insert into user_login (user_name, password, employee_code, failed_attempts, salt, password_changed_date, is_locked, is_login_active, created_by, created_date, last_modified_by, last_modified_date) values
	('admin', '9Q7o1ElIsrg=', 'admin', 0, 'uz1vnTg9Tabzf8c0QK+nwA==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('arnab', 'ge18pokmhiI=', 'arnab', 0, 'xH+xofIBq4MnQpfAk1FRSQ==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('arnab02', NULL, 'arnab02', 0, 'JgI4buj75dWXwRw1hopPOw==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('bos.abo', 'rdmx0ghcUfg=', 'bos.abo', 0, '1g20M4Sw067Xx3XymlFtyw==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('Gita', NULL, 'Gita', 0, 'oHF/imHiNU/OkBHej9aNTA==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('gwen', 'QVJPpBQ4RNA=', 'gwen', 0, 'rnhyFBTAXHNgsNQpa9PFMg==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('hun', NULL, 'hun', 0, 'm4hwk3PairmUn5r3RcrHcA==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('len', 'XlfG7LycmzY=', 'len', 0, 'X8LazpRLYnXn7pwYwRlBGQ==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('ptif', NULL, 'ptif', 0, 'GGkKETxJpG6gvvSNuxFI4Q==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('sm.abo', 'dGgtKD/B29Y=', 'sm.abo', 0, '/FtfCZP5aMyvs400GnMxKA==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('sm.kdh', 'RkDDZFu83k8=', 'sm.kdh', 0, 'uwlOGwvkv8YOAulWZi/RgA==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('sm.khn', 'C0+Det3Hqr8=', 'sm.khn', 0, 'bzHq5QktO053ZIR7V+OvJg==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('ten', 'jtM0KCzkdgA=', 'ten', 0, 'oVvVRjR7QMCFzN7r7AfxOg==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('UTcb99', NULL, 'UTcb99', 0, 'kD+H9g6fDO41Pu3WkIgXuQ==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('UTod20', NULL, 'UTod20', 0, 'Miq0XrduuE8vV9WLJ+CSmQ==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('yen', 'O70yyYp5tO0=', 'yen', 0, 'Zvl5mVNglx2krxGxgqj1nA==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('bos.khn', 'iM+zRKzswkQ=', 'bos.khn', 0, 'UA1qyxihV83bprxc+3SGxA==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('Yuzuriha', NULL, 'Yuzuriha', 0, 'QLo3hhXagGbwBIfBcfJYFA==', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('commercial', 'lZkY7XzFe4U=', 'commercial', 0, '3HDtTRnUUTayH7UG2d+hhw==', GETDATE(), 0, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('Harry', 'e3TVcciHAIM=', 'Harry', 0, 'jAvZIJtZkA5XHvaD9HHS4A==', GETDATE(), 1, 1, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('TEMP.KHN.1', NULL, 'TEMP.KHN.1', 0, '+cBd3nufD9mytQl5yTyeow==', '2020-01-27 16:30:41.853', 1, 1, 'rajani', '2020-01-27 16:30:41.853', 'rajani', '2020-01-27 16:30:41.853'),
	('Barry', 'mFU9xxnvjKQ=', 'Barry', 0, 'i4vphxUb7oRm5I/sHqBRLA===', GETDATE(), 0, 0, 'rajani', GETDATE(), 'rajani', GETDATE());

	
	
/*insert into user_otp*/

insert into user_otp (user_name, otp_token, otp_type, expiry_date, req_value, is_active, created_by, created_date, last_modified_by, last_modified_date) values
	('gwen',	'oAFAmD',	'FORGOT_PASSWORD',	DATEADD(day, 1, GETDATE()),	'forgot Password',	1,'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('gwen',	'xZg1aE',	'FORGOT_PASSWORD',	'2019-12-17 14:44:59.598',	'forgot Password',	0,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('arnab',	'AtRpfe',	'INVITED',	'2019-11-28 08:09:59.846',	'INVITED',	0,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('Harry',	'YvTQSb',	'LOGIN_ACTIVATED',	DATEADD(day, 1, GETDATE()),	'LOGIN_ACTIVATED',	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('TEMP.KHN.1',	'YvTQSc',	'INVITED',	'2020-01-30 16:30:41.853',	'invited',	1,	'rajani',	'2020-01-27 16:30:41.853',	'rajani',	'2020-01-27 16:30:41.853'),
	('UTcb99',	'ov45Vt',	'INVITED',	DATEADD(day, 1, GETDATE()),	NULL,	1,	'rajani',	GETDATE(),	'rajani',	GETDATE()),
	('sm.khn', 	'p9qVyE',	'MOBILENO_CHANGE',	DATEADD(day, 1, GETDATE()),	'8431366078',	1,	'rajani', GETDATE(), 'rajani', GETDATE());
	
	
	
/*insert into user_otp_retry*/

insert into user_otp_retry (user_name, otp_type, failed_attempts, created_by, created_date, last_modified_by, last_modified_date) values
	('UTcb99', 'INVITED', 2, 'rajani', GETDATE(), 'rajani', GETDATE()),
	('gwen', 'FORGOT_PASSWORD', 1, 'rajani', GETDATE(), 'rajani', GETDATE());



/*insert into user_doc_master*/	

insert into user_doc_master (doc_no,	location_code,	fiscal_year,	doc_type,	created_by,	created_date,	last_modified_by,	last_modified_date) values
	(3,	'KHN',	2019,	'ROLE_LMT_REQ',	'sm.khn',	'2019-12-21 11:06:00.429',	'sm.khn',	'2019-12-21 11:06:00.429'),
	(1,	'ABO',	2020,	'ROLE_LMT_REQ',	'sm.abo',	'2020-01-27 15:57:41.853',	'sm.abo',	'2020-01-27 15:57:41.853'),
	(1,	'KHN',	2020,	'TEMP_EMP_NO',	'sm.khn',	'2020-01-27 16:30:41.853',	'sm.khn',	'2020-01-27 16:30:41.853');
	
	
/*insert into role_limit_request*/

insert into role_limit_request	(req_doc_no,	req_fiscal_year,	req_location_code,	req_doc_date,	request_remarks,	requester_name,	requester_contact_no,	owner_type,	status,	approved_by,	approval_remarks,	approval_date,	created_by,	created_date,	last_modified_by,	last_modified_date,	role_name,	address) values
	(1, 2019,	'KHN',	'2019-12-11 11:06:00.431',	'Test',	'KHN SM',	'8877165541',	'L3',	'APPROVED',	NULL,	NULL,	NULL,	'sm.khn',	'2019-12-21 11:06:00.430', 'admin',	'2019-12-11 11:06:00.430',	'Store Manager',	'277-279, Near Guruduwara Kaligadhara SahibAdjoining Guru Amardas Market, G T Road,'),
	(2, 2019,	'KHN',	'2019-12-15 11:06:00.431',	'Test',	'KHN SM',	'8877165541',	'L3',	'PENDING',	NULL,	NULL,	NULL,	'sm.khn',	'2019-12-15 11:06:00.430', 'sm.khn',	'2019-12-15 11:06:00.430',	'Store Manager',	'277-279, Near Guruduwara Kaligadhara SahibAdjoining Guru Amardas Market, G T Road,'),
	(3, 2019,	'KHN',	'2019-12-21 11:06:00.431',	'Test',	'KHN SM',	'8877165541',	'L3',	'PENDING',	NULL,	NULL,	NULL,	'sm.khn',	'2019-12-21 11:06:00.430', 'sm.khn',	'2019-12-21 11:06:00.430',	'Store Manager',	'277-279, Near Guruduwara Kaligadhara SahibAdjoining Guru Amardas Market, G T Road,'),
	(4, 2020,	'ABO',	'2020-01-27 15:57:41.891',	'Test',	'ABO SM',	'8608455832',	'L3',	'REJECTED',	NULL,	NULL,	NULL,	'sm.abo',	'2020-01-27 15:57:41.891', 'admin',	'2020-01-28 15:57:41.891',	'Store Manager',	'277-279, Near Guruduwara Kaligadhara SahibAdjoining Guru Amardas Market, G T Road,');
	
	
	
/*insert into role_limit_request_details*/

insert into role_limit_request_details (id,	role_limit_request_id,	role_code,	req_value,	approved_value,	status,	created_by,	created_date,	last_modified_by,	last_modified_date)	values
	(NEWID(),	1,	'SM',	6,	NULL,	'APPROVED',	'sm.khn',	'2019-12-11 11:06:00.431',	'adminn',	'2019-12-11 11:06:00.431'),
	(NEWID(),	3,	'SM',	7,	NULL,	'PENDING',	'sm.khn',	'2019-12-21 11:06:00.431',	'sm.khn',	'2019-12-21 11:06:00.431'),
	(NEWID(),	3,	'BOS',	8,	NULL,	'PENDING',	'sm.khn',	'2019-12-21 11:06:00.433',	'sm.khn',	'2019-12-21 11:06:00.433'),
	(NEWID(),	3,	'CASHIER',	7,	NULL,	'PENDING',	'sm.khn',	'2019-12-21 11:06:00.436',	'sm.khn',	'2019-12-21 11:06:00.436'),
	(NEWID(),	4,	'CASHIER',	7,	NULL,	'APPROVED',	'sm.abo',	'2020-01-27 15:57:41.891',	'admin',	'2020-01-28 15:57:41.891');
	