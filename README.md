# 🍽️ Fork and Feast: Restaurant Reservation System

## 🎯 Problem Statement
In today's fast-paced world, dining out often comes with the hassle of long waiting times, last-minute unavailability, and inefficient booking systems. Customers face difficulties in securing tables at their favorite restaurants, leading to frustration and lost dining experiences. Restaurants, on the other hand, struggle to manage their seating arrangements efficiently, often missing opportunities to optimize their customer flow and revenue. There's a growing need for a seamless, technology-driven solution to bridge this gap between diners and restaurants.

## 💡 Proposed Solution
This restaurant reservation system is a web-based platform with two key dashboards for users and restaurants. Customers can:
- Search for restaurants
- Filter based on preferences
- Reserve tables
- Edit and cancel reservations

Restaurant owner can:
- Add Restaurant and Edit Restaurant
- View table bookings

The system ensures transparency and user convenience, offering modification and deletion capabilities for reservations.

## 🛠️ Setup
### Prerequisites
1. **Node.js**
2. **MongoDB** (local or cloud)
3. **Git**

### Clone Repository
```bash
git init
git clone https://github.com/maulikk04/IT314_G28_Restaurant_Reservation_System.git
```

### Backend Setup
Create a `.env` file with the following contents:
```bash
MONGO_URI=<your mongo url>
JWT_SECRET=<your secret>
email=<your email>
password=<your password>
CLIENT_ID=<Your ClientId of OAuth>
CLIENT_SECRET=<Your Client Secret of OAuth>
SESSION_SECRET=<Your session secret>
port=<port>
BACKEND_URL=http://localhost:port
FRONTEND_URL=http://localhost:frontend port
```

In VSCode terminal:
```bash
cd Backend
npm install
# To run Backend
npm run dev
```

### Frontend Setup
Create a `.env` file with the following contents:
```bash
REACT_APP_API_URL=http://localhost:backendport
REACT_APP_WS_URL=ws://localhost:backendport
```

In VSCode terminal:
```bash
cd Frontend
npm install
# To run Frontend
npm start
```
## 🚀 Future Goals
While the restaurant reservation system has made significant strides, several critical functionalities are yet to be realized:

1. **Payment Gateway**: Implement a seamless advance payment system to secure bookings and enhance reliability.

2. **Subscription Model**: Develop premium features and membership benefits to create recurring revenue and improve user engagement.

3. **Offers and Discounts**: Create a mechanism to provide incentives for user sign-ups and attract restaurant partnerships.

Addressing these unimplemented requirements would significantly elevate the platform's utility and competitive edge.

## 👥 Contributors
| GitHub ID | Name |
|-----------|------|
| [Maulik](https://github.com/maulikk04) | Maulik Kansara - 202201442|
| [Vraj](https://github.com/Gandhi008)| Vraj Gandhi - 202201425|  
| [Rit](https://github.com/rit2903) | Rit Trambadia  - 202201424 |
| [Rakshit](https://github.com/Rakshit-Pandhi)  |   Rakshit Pandhi  - 202201426 |
| [Dev](https://github.com/Dev-yas)       |   Dev Vyas - 202201453 |
| [Stuti](https://github.com/stuti1544)         |   Stuti Pandya  - 202201439|
| [Mausam](https://github.com/Mausamk123)         |  Mausam Kamdar - 202201372  |
| [Nisarg](https://github.com/Nisarg2004-AFK)         |   Nisarg Parmar - 202201443  |
| [Ridham](https://github.com/202201430)         |   Ridham Patel - 202201430  |
| [Harshil](https://github.com/Harshil717)       |    Harshil Parmar - 202201371 |


