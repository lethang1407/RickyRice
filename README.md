# Ricky Rice Management System (RRMS)

## Introduction
The Ricky Rice Management System (RRMS) is a comprehensive software solution designed to streamline and optimize rice-related business operations. This system aims to automate sales, manage inventory, and optimize logistics for rice distributors and warehouse operators.

## Features
### Rice Sales Module:
- Manages customer orders, generates invoices, and tracks payments.
- Integrates with financial systems for transaction reconciliation.
- Provides sales analytics and reporting.

### Outbound Management Module:
- Schedules and dispatches rice shipments efficiently.
- Tracks outbound orders in real-time.
- Optimizes delivery routes for timely deliveries.

### Warehouse Management Module:
- Maintains accurate rice inventory records.
- Monitors rice quality and storage conditions.
- Supports warehouse operations including receiving, storing, and dispatching rice.

## User Roles
- **Admin**: Full system access, including inventory control, sales tracking, and user account management.
- **Store Owner**: Oversees business operations, manages suppliers, and monitors stock availability.
- **Employee**: Handles sales, updates inventory, and assists customers.
- **Customer**: Browses products, filter products.

## Technology Stack
- **Frontend**: React
- **Backend**: Java Spring
- **Database**: SQL Server
- **Cloud Storage**: Cloudinary (for image uploads)
- **Payment Integration**: Supports various payment methods (cash, bank transfers, mobile payments)

## Operating Environment
- **Hardware**: Desktop computers, tablets (used by store employees)
- **Operating Systems**: Windows, macOS
- **Server & Database**: Cloud-based database for inventory and transaction management
- **Internet Access**: Required for cloud synchronization and online orders
- **Peripheral Support**: Compatible with barcode scanners and receipt printers

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Regera24/SP25_SWP391_Group5_SE1889VJ.git
   ```
2. Install dependencies:
   ```sh
   npm install   # for frontend
   mvn clean install   # for backend
   ```
3. Configure the database connection in `application.properties` (backend) and `.env` (frontend).
4. Start the backend:
   ```sh
   mvn spring-boot:run
   ```
5. Start the frontend:
   ```sh
   npm start
   ```

## Assumptions & Constraints
- Requires stable internet connectivity for cloud-based features.
- Compliance with local food safety and business regulations.
- Optimized for low-cost hardware to support smaller businesses.
- Users need to adopt digital workflows instead of manual record-keeping.

## References
- [KiotViet](https://www.kiotviet.vn/)

## Contributing
Contributions are welcome! Please submit a pull request or report issues in the GitHub repository.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any inquiries or support, please contact **G5-SE1889VJ** at **rickyrice@gmail.com**.

