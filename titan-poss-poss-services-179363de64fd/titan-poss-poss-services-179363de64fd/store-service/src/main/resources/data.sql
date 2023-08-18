/* delete data from all tables*/

DELETE FROM catchment_master;
DELETE FROM customer_town_master;
DELETE FROM customer_lov_master;




/*insert into customer_lov_master*/

insert into customer_lov_master (id, lov_type, code, value, is_active, created_by, created_date, last_modified_by, last_modified_date) values
	(NEWID(), 'CUSTOMER_TYPE', 'OneTime', 'OneTime Customer', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
	(NEWID(), 'CUSTOMER_TYPE', 'Institutional', 'Institutional Customer', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
	(NEWID(), 'CUSTOMER_TYPE', 'Regular', 'Regular Customer', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
	(NEWID(), 'CUSTOMER_TYPE', 'International', 'International Customer', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
	(NEWID(), 'SALUTATION', 'Mrs', 'Mrs', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
	(NEWID(), 'SALUTATION', 'Mr', 'Mr', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
	(NEWID(), 'SALUTATION', 'M/S', 'M/S', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE());
 
 
 /*insert into customer_town_master*/
 
 insert into customer_town_master (town_code, location_code, state_code, description, is_active, created_by, created_date, last_modified_by, last_modified_date) values
 	(1, 'KHN', 1, 'Bengaluru', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
 	(2, 'KHN', 1, 'Mysore', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE());



 /*insert into catchment_master*/
 
 insert into catchment_master(catchment_code, location_code, description, is_active, created_by, created_date, last_modified_by, last_modified_date) values
 	('Ken', 'KHN', 'Kengeri', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
 	('BU', 'KHN', 'Bengaluru University', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
 	('RAJ', 'KHN', 'Rajarajeshwari', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE()),
 	('LK', 'URB', 'LUCKNOW', 1, 'ADMIN', GETDATE(), 'ADMIN', GETDATE());
 
 
 	