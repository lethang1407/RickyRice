INSERT INTO permission (id, code, description)
VALUES 
    (1, 'READ_USER', 'Permission to read user data'),
    (2, 'WRITE_USER', 'Permission to write user data'),
    (3, 'DELETE_USER', 'Permission to delete user data'),
    (4, 'READ_PERMISSION', 'Permission to read permissions'),
    (5, 'READ_ROLE', 'Permission to read role data'),
    (6, 'CREATE_ROLE', 'Permission to create new roles'),
    (7, 'UPDATE_ROLE', 'Permission to update existing roles'),
    (8, 'DELETE_ROLE', 'Permission to delete roles'),
    (9, 'READ_INVOICE', 'Permission to read invoice data'),
    (10, 'CREATE_INVOICE', 'Permission to create new invoices'),
    (11, 'READ_ACCOUNT', 'Permission to read account data'),
    (12, 'UPDATE_ACCOUNT', 'Permission to update existing accounts'),
    (13, 'DELETE_ACCOUNT', 'Permission to delete accounts'),
    (14, 'READ_EMPLOYEE', 'Permission to read employee data'),
    (15, 'CREATE_EMPLOYEE', 'Permission to create new employees'),
    (16, 'UPDATE_EMPLOYEE', 'Permission to update existing employees'),
    (17, 'DELETE_EMPLOYEE', 'Permission to delete employees'),
    (18, 'READ_STORE', 'Permission to read store data'),
    (19, 'CREATE_STORE', 'Permission to create new stores'),
    (20, 'UPDATE_STORE', 'Permission to update existing stores'),
    (21, 'DELETE_STORE', 'Permission to delete stores'),
    (22, 'READ_SUBSCRIPTION_PLAN', 'Permission to read subscription plan data'),
    (23, 'CREATE_SUBSCRIPTION_PLAN', 'Permission to create new subscription plans'),
    (24, 'UPDATE_SUBSCRIPTION_PLAN', 'Permission to update existing subscription plans'),
    (25, 'DELETE_SUBSCRIPTION_PLAN', 'Permission to delete subscription plans'),
    (26, 'READ_STATISTICS', 'Permission to read store statistics data'),
    (27, 'CREATE_STATISTICS', 'Permission to create new store statistics'),
    (28, 'UPDATE_STATISTICS', 'Permission to update existing store statistics'),
    (29, 'DELETE_STATISTICS', 'Permission to delete store statistics'),
    (30, 'READ_ZONE', 'Permission to read zone data'),
    (31, 'CREATE_ZONE', 'Permission to create new zones'),
    (32, 'UPDATE_ZONE', 'Permission to update existing zones'),
    (33, 'DELETE_ZONE', 'Permission to delete zones'),
    (34, 'READ_PRODUCT', 'Permission to read product data'),
    (35, 'CREATE_PRODUCT', 'Permission to create new products'),
    (36, 'UPDATE_PRODUCT', 'Permission to update existing products'),
    (37, 'DELETE_PRODUCT', 'Permission to delete products'),
    (38, 'READ_CATEGORY', 'Permission to read category data'),
    (39, 'CREATE_CATEGORY', 'Permission to create new categories'),
    (40, 'UPDATE_CATEGORY', 'Permission to update existing categories'),
    (41, 'DELETE_CATEGORY', 'Permission to delete categories'),
    (42, 'READ_PRODUCT_ATTRIBUTE', 'Permission to read product attribute data'),
    (43, 'CREATE_PRODUCT_ATTRIBUTE', 'Permission to create new product attributes'),
    (44, 'UPDATE_PRODUCT_ATTRIBUTE', 'Permission to update existing product attributes'),
    (45, 'DELETE_PRODUCT_ATTRIBUTE', 'Permission to delete product attributes'),
    (46, 'READ_CUSTOMER', 'Permission to read customer data'),
    (47, 'CREATE_CUSTOMER', 'Permission to create new customers'),
    (48, 'UPDATE_CUSTOMER', 'Permission to update existing customers'),
    (49, 'DELETE_CUSTOMER', 'Permission to delete customers'),
    (50, 'READ_DEBT', 'Permission to read debt data'),
    (51, 'CREATE_DEBT', 'Permission to create new debts'),
    (52, 'UPDATE_DEBT', 'Permission to update existing debts'),
    (53, 'DELETE_DEBT', 'Permission to delete debts');

INSERT INTO Role (id, Code, Description)
VALUES 
    ('1', 'ADMIN', 'Administrator role with all permissions'),
    ('2', 'STORE_OWNER', 'Store owner role with relevant permissions'),
    ('3', 'EMPLOYEE', 'Employee role with limited permissions');

INSERT INTO has_permission (roleid, permissionid)
VALUES 
    ('1', 1),  -- READ_USER
    ('1', 2),  -- WRITE_USER
    ('1', 3),  -- DELETE_USER
    ('1', 4),  -- READ_PERMISSION
    ('1', 5),  -- READ_ROLE
    ('1', 6),  -- CREATE_ROLE
    ('1', 7),  -- UPDATE_ROLE
    ('1', 8),  -- DELETE_ROLE
    ('1', 9),  -- READ_INVOICE
    ('1', 10), -- CREATE_INVOICE
    ('1', 11), -- READ_ACCOUNT
    ('1', 12), -- UPDATE_ACCOUNT
    ('1', 13), -- DELETE_ACCOUNT
    ('1', 14), -- READ_EMPLOYEE
    ('1', 15), -- CREATE_EMPLOYEE
    ('1', 16), -- UPDATE_EMPLOYEE
    ('1', 17), -- DELETE_EMPLOYEE
    ('1', 18), -- READ_STORE
    ('1', 19), -- CREATE_STORE
    ('1', 20), -- UPDATE_STORE
    ('1', 21), -- DELETE_STORE
    ('1', 22), -- READ_SUBSCRIPTION_PLAN
    ('1', 23), -- CREATE_SUBSCRIPTION_PLAN
    ('1', 24), -- UPDATE_SUBSCRIPTION_PLAN
    ('1', 25), -- DELETE_SUBSCRIPTION_PLAN
    ('1', 26), -- READ_STATISTICS
    ('1', 27), -- CREATE_STATISTICS
    ('1', 28), -- UPDATE_STATISTICS
    ('1', 29), -- DELETE_STATISTICS
    ('1', 30), -- READ_ZONE
    ('1', 31), -- CREATE_ZONE
    ('1', 32), -- UPDATE_ZONE
    ('1', 33), -- DELETE_ZONE
    ('1', 34), -- READ_PRODUCT
    ('1', 35), -- CREATE_PRODUCT
    ('1', 36), -- UPDATE_PRODUCT
    ('1', 37), -- DELETE_PRODUCT
    ('1', 38), -- READ_CATEGORY
    ('1', 39), -- CREATE_CATEGORY
    ('1', 40), -- UPDATE_CATEGORY
    ('1', 41), -- DELETE_CATEGORY
    ('1', 42), -- READ_PRODUCT_ATTRIBUTE
    ('1', 43), -- CREATE_PRODUCT_ATTRIBUTE
    ('1', 44), -- UPDATE_PRODUCT_ATTRIBUTE
    ('1', 45), -- DELETE_PRODUCT_ATTRIBUTE
    ('1', 46), -- READ_CUSTOMER
    ('1', 47), -- CREATE_CUSTOMER
    ('1', 48), -- UPDATE_CUSTOMER
    ('1', 49), -- DELETE_CUSTOMER
    ('1', 50), -- READ_DEBT
    ('1', 51), -- CREATE_DEBT
    ('1', 52), -- UPDATE_DEBT
    ('1', 53); -- DELETE_DEBT

	INSERT INTO has_permission (roleid, permissionid)
VALUES 
    ('2', 9),   -- READ_INVOICE
    ('2', 10),  -- CREATE_INVOICE
    ('2', 18),  -- READ_STORE
    ('2', 19),  -- CREATE_STORE
    ('2', 20),  -- UPDATE_STORE
    ('2', 34),  -- READ_PRODUCT
    ('2', 35),  -- CREATE_PRODUCT
    ('2', 36),  -- UPDATE_PRODUCT
    ('2', 38),  -- READ_CATEGORY
    ('2', 39),  -- CREATE_CATEGORY
    ('2', 40),  -- UPDATE_CATEGORY
    ('2', 46),  -- READ_CUSTOMER
    ('2', 47),  -- CREATE_CUSTOMER
    ('2', 48),  -- UPDATE_CUSTOMER
    ('2', 50),  -- READ_DEBT
    ('2', 51);  -- CREATE_DEBT

	INSERT INTO has_permission (roleid, permissionid)
VALUES 
    ('3', 9),   -- READ_INVOICE
    ('3', 10),  -- CREATE_INVOICE
    ('3', 34),  -- READ_PRODUCT
    ('3', 35),  -- CREATE_PRODUCT
    ('3', 46),  -- READ_CUSTOMER
    ('3', 47),  -- CREATE_CUSTOMER
    ('3', 50),  -- READ_DEBT
    ('3', 51);  -- CREATE_DEBT

	INSERT INTO Account (id, Username, Password, Email, [phone_number], Avatar, [created_at], [is_active], Gender, [birth_date], RoleID)
VALUES 
    -- Admin Account
    (1, 'admin_user', '123', 'admin@example.com', '0123456789', NULL, CURRENT_TIMESTAMP, 1, NULL, NULL, '1'),
    -- Store Owner Account
    (2, 'store_owner', '123', 'storeowner@example.com', '0987654321', NULL, CURRENT_TIMESTAMP, 1, NULL, NULL, '2'),
    -- Employee Account 1
    (3, 'employee_1', '123', 'employee1@example.com', '0112233445', NULL, CURRENT_TIMESTAMP, 1, NULL, NULL, '3'),
    -- Employee Account 2
    (4, 'employee_2', '123', 'employee2@example.com', '0998877665', NULL, CURRENT_TIMESTAMP, 1, NULL, NULL, '3');

	INSERT INTO [dbo].[subscription_plan] (id, Name, Description, Price)
VALUES 
    ('1', 'Basic Plan', 'Provides basic features for small businesses.', 29.99),
    ('2', 'Standard Plan', 'Includes additional tools for medium-sized businesses.', 79.99),
    ('3', 'Premium Plan', 'Full-featured package for large enterprises.', 149.99);

	INSERT INTO Store (id, [store_name], Address, Hotline, Description, [operating_hour], [created_at], [expire_at], Image, AccountID, [subscription_planid])
VALUES 
    ('1', 'Store One', '123 Main Street', '0123456789', 'First store description', '8 AM - 8 PM', CURRENT_TIMESTAMP, NULL, 'image_store_one.jpg', 2, 1),
    ('2', 'Store Two', '456 High Street', '0987654321', 'Second store description', '9 AM - 7 PM', CURRENT_TIMESTAMP, NULL, 'image_store_two.jpg', 2, 2),
    ('3', 'Store Three', '789 Elm Street', '0112233445', 'Third store description', '10 AM - 9 PM', CURRENT_TIMESTAMP, NULL, 'image_store_three.jpg', 2, 3);

	INSERT INTO Employee (id, AccountID, StoreID)
VALUES 
    ('1', '3', '1'),
    ('2', '4', '1');

	INSERT INTO store_statistics (id, [created_at], Description, Type, total_money, StoreID)
VALUES 
    ('1', CURRENT_TIMESTAMP, 'Export', 1, 1000.50, '1'),
    ('2', CURRENT_TIMESTAMP, 'Export', 1, 2000.75, '2'),
    ('3', CURRENT_TIMESTAMP, 'Export', 1, -150.00, '1'),
    ('4', CURRENT_TIMESTAMP, 'Import', 0, 3000.00, '2'),
    ('5', CURRENT_TIMESTAMP, 'Import', 0, -500.00, '1');

	INSERT INTO Category (id, Name, Description, StoreID)
VALUES 
    ('1', N'Gạo Jasmine', N'Gạo thơm cao cấp, hoàn hảo cho việc nấu ăn hàng ngày.', '1'),
    ('2', N'Gạo Lứt', N'Gạo lứt nguyên cám, giàu dinh dưỡng và tốt cho sức khỏe.', '1'),
    ('3', N'Gạo Basmati', N'Gạo hạt dài, thơm, lý tưởng cho các món cơm biryani và pilaf.', '2'),
    ('4', N'Nếp', N'Hoàn hảo cho các món tráng miệng truyền thống và các món xôi.', '2'),
    ('5', N'Gạo Hấp', N'Gạo đã được hấp sẵn, dễ dàng nấu và bảo quản trong thời gian dài.', '1');

	INSERT INTO Product (id, Name, Price, Information, Product_image, StoreID, CategoryID)
VALUES 
    ('1', N'Gạo Jasmine Loại 1', 20000, N'Gạo thơm cao cấp, hạt dài, thích hợp cho bữa ăn gia đình.', 'jasmine_1.jpg', '1', '1'),
    ('2', N'Gạo Jasmine Loại 2', 25000, N'Gạo Jasmine xuất khẩu, nấu chín mềm và thơm.', 'jasmine_2.jpg', '1', '1'),
    ('3', N'Gạo Lứt Đỏ', 30000, N'Gạo lứt đỏ, giàu dinh dưỡng và tốt cho sức khỏe.', 'brown_red.jpg', '1', '2'),
    ('4', N'Gạo Lứt Đen', 32000, N'Gạo lứt đen, giàu chất chống oxy hóa và vitamin.', 'brown_black.jpg', '1', '2'),
    ('5', N'Gạo Basmati Ấn Độ', 45000, N'Gạo Basmati nhập khẩu, thích hợp với các món ăn Ấn.', 'basmati_1.jpg', '2', '3'),
    ('6', N'Gạo Basmati Cao Cấp', 48000, N'Gạo Basmati cao cấp với hương thơm tự nhiên.', 'basmati_2.jpg', '2', '3'),
    ('7', N'Nếp Truyền Thống', 25000, N'Nếp truyền thống, thích hợp nấu xôi và các món ăn truyền thống.', 'sticky_rice.jpg', '2', '4'),
    ('8', N'Nếp Thái Loại 1', 26000, N'Nếp Thái hạt tròn, dẻo ngon, phù hợp mọi món ăn đặc biệt.', 'sticky_rice_thai.jpg', '2', '4'),
    ('9', N'Gạo Hấp Loại 1', 22000, N'Gạo hấp sẵn, dễ dàng chế biến mọi món ăn.', 'parboiled_1.jpg', '1', '5'),
    ('10', N'Gạo Hấp Đặc Biệt', 28000, N'Gạo hấp giàu dinh dưỡng và bảo quản lâu dài.', 'parboiled_2.jpg', '1', '5');

	INSERT INTO Zone (id, Name, Location, Quantity, Size, ProductID, StoreID)
VALUES 
    ('1', N'Khu Chứa Gạo Jasmine 1', N'Kho A1', 100, 50, '1', '1'),
    ('2', N'Khu Chứa Gạo Jasmine 2', N'Kho A2', 150, 60, '2', '1'),
    ('3', N'Khu Chứa Gạo Lứt Đỏ', N'Kho B1', 200, 70, '3', '1'),
    ('4', N'Khu Chứa Gạo Lứt Đen', N'Kho B2', 120, 55, '4', '1'),
    ('5', N'Khu Gạo Basmati Ấn Độ', N'Kho C1', 300, 90, '5', '2'),
    ('6', N'Khu Gạo Basmati Cao Cấp', N'Kho C2', 250, 80, '6', '2'),
    ('7', N'Khu Nếp Truyền Thống', N'Kho D1', 220, 75, '7', '2'),
    ('8', N'Khu Nếp Thái Loại 1', N'Kho D2', 180, 65, '8', '2'),
    ('9', N'Khu Chứa Gạo Hấp Loại 1', N'Kho E1', 160, 68, '9', '1'),
    ('10', N'Khu Chứa Gạo Hấp Đặc Biệt', N'Kho E2', 200, 72, '10', '1'),
    ('11', N'Khu Dự Trữ Gạo Jasmine 1', N'Kho F1', 90, 30, '1', '1'),
    ('12', N'Khu Dự Trữ Gạo Lứt Đỏ', N'Kho F2', 220, 85, '3', '1');

	INSERT INTO product_attribute (id, value, StoreID)
VALUES 
    ('1', N'Hạt dài', '1'),
    ('2', N'Thơm tự nhiên', '1'),
    ('3', N'Dẻo mềm', '1'),
    ('4', N'Nguyên cám', '1'),
    ('5', N'Giàu dinh dưỡng', '2'),
    ('6', N'Chống oxy hóa', '2'),
    ('7', N'Dễ bảo quản', '2'),
    ('8', N'Nấu nhanh', '2');

	INSERT INTO has_attribute (ProductID, product_attributeid)
VALUES 
    ('1', '1'), -- Gạo Jasmine Loại 1 - Hạt dài
    ('1', '2'), -- Gạo Jasmine Loại 1 - Thơm tự nhiên
    ('1', '3'), -- Gạo Jasmine Loại 1 - Dẻo mềm
    ('2', '1'), -- Gạo Jasmine Loại 2 - Hạt dài
    ('2', '2'), -- Gạo Jasmine Loại 2 - Thơm tự nhiên
    ('2', '3'), -- Gạo Jasmine Loại 2 - Dẻo mềm
    ('3', '4'), -- Gạo Lứt Đỏ - Nguyên cám
    ('3', '5'), -- Gạo Lứt Đỏ - Giàu dinh dưỡng
    ('3', '6'), -- Gạo Lứt Đỏ - Chống oxy hóa
    ('4', '4'), -- Gạo Lứt Đen - Nguyên cám
    ('4', '5'), -- Gạo Lứt Đen - Giàu dinh dưỡng
    ('4', '6'), -- Gạo Lứt Đen - Chống oxy hóa
    ('5', '1'), -- Gạo Basmati Ấn Độ - Hạt dài
    ('5', '2'), -- Gạo Basmati Ấn Độ - Thơm tự nhiên
    ('5', '7'), -- Gạo Basmati Ấn Độ - Dễ bảo quản
    ('6', '1'), -- Gạo Basmati Cao Cấp - Hạt dài
    ('6', '2'), -- Gạo Basmati Cao Cấp - Thơm tự nhiên
    ('6', '7'), -- Gạo Basmati Cao Cấp - Dễ bảo quản
    ('7', '3'), -- Nếp Truyền Thống - Dẻo mềm
    ('7', '5'), -- Nếp Truyền Thống - Giàu dinh dưỡng
    ('8', '3'), -- Nếp Thái Loại 1 - Dẻo mềm
    ('8', '5'), -- Nếp Thái Loại 1 - Giàu dinh dưỡng
    ('9', '7'), -- Gạo Hấp Loại 1 - Dễ bảo quản
    ('9', '8'), -- Gạo Hấp Loại 1 - Nấu nhanh
    ('10', '7'), -- Gạo Hấp Đặc Biệt - Dễ bảo quản
    ('10', '8'); -- Gạo Hấp Đặc Biệt - Nấu nhanh

	INSERT INTO Customer (id, Name, phone_number, Address, Email, StoreID)
VALUES 
    ('1', N'Nguyen Van A', '0987654321', N'123 Đường 1, Quận 1, TP. HCM', 'nguyenvana@example.com', '1'),
    ('2', N'Tran Thi B', '0912345678', N'456 Đường 2, Quận 2, TP. HCM', 'tranthib@example.com', '1'),
    ('3', N'Le Hoang C', '0901234567', N'789 Đường 3, Quận 3, TP. HCM', 'lehoangc@example.com', '2'),
    ('4', N'Pham Minh D', '0976543210', N'12 Đường 4, Quận 4, TP. HCM', 'phamminhd@example.com', '2'),
    ('5', N'Nguyen Thi E', '0965432109', N'34 Đường 5, Quận 5, TP. HCM', 'nguyenthie@example.com', '1');

	INSERT INTO Debt (id, Amount, Description, [created_at], Status, CustomerID, StoreID)
VALUES 
    ('1', 500000, N'Mua gạo Jasmine Loại 1', '2023-10-01', N'Unpaid', '1', '1'),
    ('2', 300000, N'Mua gạo Basmati Ấn Độ', '2023-10-05', N'Paid', '2', '1'),
    ('3', 450000, N'Mua gạo Lứt Đỏ', '2023-10-10', N'Unpaid', '3', '2'),
    ('4', 600000, N'Mua Nếp Truyền Thống', '2023-10-15', N'Paid', '4', '2'),
    ('5', 700000, N'Mua gạo Hấp Loại 1', '2023-10-18', N'Unpaid', '5', '1');

	INSERT INTO Invoice (id, [created_at], [product_money], [ship_money], Description, Type, Status, CustomerID, StoreID, [customer_name], [customer_phone_number])
VALUES
    ('1', '2023-11-01T10:00:00', 500000, 20000, N'Mua gạo Jasmine Loại 1', 1, 1, '1', '1', N'Nguyen Văn A', '0123456789'),
    ('2', '2023-11-01T11:30:00', 300000, 15000, N'Mua gạo Basmati Ấn Độ', 1, 1, '2', '1', N'Nguyen Văn A', '0123456789'),
    ('3', '2023-11-01T14:00:00', 450000, 25000, N'Mua gạo Lứt Đỏ', 0, 0, '3', '2', N'Nguyen Văn A', '0123456789'),
    ('4', '2023-11-02T10:00:00', 600000, 30000, N'Mua Nếp Truyền Thống', 1, 0, '4', '2', N'Nguyen Văn A', '0123456789'),
    ('5', '2023-11-02T12:00:00', 700000, 20000, N'Mua gạo Hấp Loại 1', 1, 0, '5', '1', N'Nguyen Văn A', '0123456789'),
    ('6', '2023-11-02T15:00:00', 500000, 15000, N'Mua gạo Jasmine Loại 2', 0, 0, '1', '1', N'Nguyen Văn A', '0123456789'),
    ('7', '2023-11-03T09:30:00', 800000, 25000, N'Mua gạo Basmati Cao Cấp', 1, 1, '2', '1', N'Nguyen Văn A', '0123456789'),
    ('8', '2023-11-03T11:00:00', 450000, 30000, N'Mua Nếp Thái Loại 1', 1, 0, '3', '2', N'Nguyen Văn A', '0123456789'),
    ('9', '2023-11-03T13:45:00', 500000, 20000, N'Mua gạo Lứt Đen', 0, 1, '4', '2', N'Nguyen Văn A', '0123456789'),
    ('10', '2023-11-04T10:15:00', 700000, 25000, N'Mua gạo Hấp Đặc Biệt', 1, 0, '5', '1', N'Nguyen Văn A', '0123456789');

	INSERT INTO invoice_detail (id, Quantity, Discount, InvoiceID, product_name, product_information, product_price, product_category_name, product_category_description)
VALUES
    ('1', 2, 5, '1', N'Gạo Jasmine Loại 1', N'Premium quality Jasmine rice', 250000, N'Gạo Jasmine', N'High-quality Jasmine rice for daily use'),
    ('2', 1, 3, '2', N'Gạo Basmati Ấn Độ', N'Indian premium Basmati rice', 300000, N'Gạo Basmati', N'Fragrant Basmati rice imported from India'),
    ('3', 3, 10, '3', N'Gạo Lứt Đỏ', N'Nutritious Red Rice', 150000, N'Gạo Lứt', N'Healthy red rice with high fiber content'),
    ('4', 2, 8, '4', N'Nếp Truyền Thống', N'Traditional Sticky Rice', 300000, N'Gạo Nếp', N'Traditional Vietnamese sticky rice'),
    ('5', 4, 7, '5', N'Gạo Hấp Loại 1', N'Steamed Rice Type 1', 175000, N'Gạo Hấp', N'Premium steamed rice, Type 1'),
    ('6', 2, 5, '6', N'Gạo Jasmine Loại 2', N'Affordable Jasmine rice', 250000, N'Gạo Jasmine', N'Best value Jasmine rice'),
    ('7', 5, 15, '7', N'Gạo Basmati Cao Cấp', N'Premium Basmati rice', 160000, N'Gạo Basmati', N'Exclusive imported Basmati rice'),
    ('8', 1, 0, '8', N'Nếp Thái Loại 1', N'Thai Sticky Rice Type 1', 450000, N'Gạo Nếp', N'Sticky rice imported from Thailand'),
    ('9', 2, 12, '9', N'Gạo Lứt Đen', N'Black Rice, high in antioxidants', 250000, N'Gạo Lứt', N'Healthy black rice full of nutrients'),
    ('10', 5, 0, '10', N'Gạo Hấp Đặc Biệt', N'Special Edition Steamed Rice', 140000, N'Gạo Hấp', N'Delicious high-grade steamed rice');

	INSERT INTO app_statistics (id, StoreID, subcription_plan_name, subcription_plan_price, subcription_description, subcription_time_of_expiration)
VALUES 
    ('1', '1', N'Standard Plan', 100.00, N'A standard subscription plan for small businesses', 30),
    ('2', '2', N'Premium Plan', 200.00, N'A premium subscription plan with additional features', 60),
    ('3', '3', N'Enterprise Plan', 300.00, N'An enterprise subscription plan for larger businesses', 90);

	UPDATE Invoice
SET created_by = 1;

UPDATE product
SET created_by = 1;

UPDATE store_statistics
SET created_by = 1;

UPDATE debt
SET created_by = 1;



