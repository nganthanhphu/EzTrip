# EzTrip

EzTrip is a comprehensive travel booking platform that provides users with the ability to explore and book services such as accommodations, tourism packages, and transportation, along with robust management features for providers. With a user-friendly interface and integration of modern technologies, EzTrip delivers a seamless experience for both customers and service providers.

## Features

- Browse accommodations, tourism packages, and transportation services.
- Register and log in as a customer or provider.
- Book services, review completed bookings, and view booking history.
- Pay for bookings through supported payment integrations: Momo, VNPay, and ZaloPay.
- Provider dashboard for service management, booking tracking and statistics.
- Realtime chat support between customers and providers using Firebase.
- Admin pages for user management and statistics.
- AI-assisted provider descriptions, service comparisons and review summaries with Gemini.
- Cloudinary integration for image uploads and management.

## Tech Stack

### Backend

- Spring MVC
- Spring Security
- Hibernate ORM
- Thymeleaf
- JWT authentication
- Cloudinary
- Spring AI with Google GenAI
- Momo, VNPay, and ZaloPay payment integrations

### Frontend

- React
- React Bootstrap
- Axios
- Firebase
- Gemini API for AI features

## Project Structure

```text
EzTrip/
├─ Database/      # Database schema and sample data
├─ EzTripApp/     # Spring MVC backend
└─ eztripweb/     # React frontend
```

## Prerequisites

- Java 17 or higher
- Node.js and npm
- Apache Tomcat 10.1+

## Setup

1. Clone the repository
2. Create the database using SQL scripts in repository
3. Config backend `.properties` file, use `.properties.example` for reference
4. Build and deploy the backend
5. Install frontend dependencies using `npm install` in the `eztripweb` directory
6. Configure `.env` frontend file, use `.env.example` for reference
7. Run the frontend using `npm start`

## Contributors

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Marcoh05P">
        <img src="https://github.com/Marcoh05P.png" width="100px;" alt="Hoàng Phi Hùng"/>
        <br />
        <sub><b>Hoàng Phi Hùng (Marcoh)</b></sub>
      </a>
      <br />
    </td>
  </tr>
</table>
</div>