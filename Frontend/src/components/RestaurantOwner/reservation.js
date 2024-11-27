import './reservation.css';
import './reset.css';
import React, { useState, useEffect } from 'react';

const Reservation = () => {
    const [bookings, setBookings] = useState([
        { 
            code: 'R001', 
            date: '2023-10-01', 
            time: '12:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'John Doe', 
            people: 2,
            tableFor2: 1,
            tableFor4: 0,
            tableFor6: 0,
            showDetails: false, // Track visibility of extra details
        },
        { 
            code: 'R002', 
            date: '2023-10-01', 
            time: '12:45 PM', 
            duration: 1, 
            status: 'Cancelled', 
            customerName: 'Jane Smith', 
            people: 4,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R003', 
            date: '2023-10-01', 
            time: '1:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Alice Brown', 
            people: 6,
            tableFor2: 0,
            tableFor4: 0,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R004', 
            date: '2023-10-01', 
            time: '2:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Mark White', 
            people: 8,
            tableFor2: 0,
            tableFor4: 2,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R005', 
            date: '2023-10-01', 
            time: '2:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Eva Green', 
            people: 10,
            tableFor2: 0,
            tableFor4: 2,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R006', 
            date: '2023-10-01', 
            time: '3:00 PM', 
            duration: 1, 
            status: 'Cancelled', 
            customerName: 'Robert King', 
            people: 4,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R007', 
            date: '2023-10-01', 
            time: '3:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Sophia Martin', 
            people: 5,
            tableFor2: 1,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R008', 
            date: '2023-10-01', 
            time: '4:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Liam Taylor', 
            people: 12,
            tableFor2: 0,
            tableFor4: 3,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R009', 
            date: '2023-10-01', 
            time: '4:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Olivia Walker', 
            people: 4,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R010', 
            date: '2023-10-01', 
            time: '5:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Ethan Scott', 
            people: 2,
            tableFor2: 1,
            tableFor4: 0,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R011', 
            date: '2023-10-01', 
            time: '5:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Mia Carter', 
            people: 3,
            tableFor2: 1,
            tableFor4: 0,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R012', 
            date: '2023-10-01', 
            time: '6:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Jack Wilson', 
            people: 6,
            tableFor2: 0,
            tableFor4: 0,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R013', 
            date: '2023-10-02', 
            time: '12:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Sophia Lee', 
            people: 2,
            tableFor2: 1,
            tableFor4: 0,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R014', 
            date: '2023-10-02', 
            time: '1:00 PM', 
            duration: 1, 
            status: 'Cancelled', 
            customerName: 'Lucas Harris', 
            people: 5,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R015', 
            date: '2023-10-02', 
            time: '1:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Hannah Davis', 
            people: 4,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R016', 
            date: '2023-10-02', 
            time: '2:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Aidan Clark', 
            people: 8,
            tableFor2: 0,
            tableFor4: 2,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R017', 
            date: '2023-10-02', 
            time: '2:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Ella Martin', 
            people: 10,
            tableFor2: 0,
            tableFor4: 2,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R018', 
            date: '2023-10-02', 
            time: '3:00 PM', 
            duration: 1, 
            status: 'Cancelled', 
            customerName: 'Noah Lewis', 
            people: 6,
            tableFor2: 0,
            tableFor4: 0,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R019', 
            date: '2023-10-02', 
            time: '3:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'James Walker', 
            people: 4,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R020', 
            date: '2023-10-02', 
            time: '4:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Charlotte Young', 
            people: 2,
            tableFor2: 1,
            tableFor4: 0,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R021', 
            date: '2023-10-02', 
            time: '4:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'David Scott', 
            people: 6,
            tableFor2: 0,
            tableFor4: 0,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R022', 
            date: '2023-10-02', 
            time: '5:00 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Lucas Hill', 
            people: 5,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R023', 
            date: '2023-10-02', 
            time: '5:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Benjamin Hall', 
            people: 2,
            tableFor2: 1,
            tableFor4: 0,
            tableFor6: 0,
            showDetails: false,
        },
        { 
            code: 'R024', 
            date: '2023-10-02', 
            time: '6:00 PM', 
            duration: 1, 
            status: 'Cancelled', 
            customerName: 'Zoe Adams', 
            people: 6,
            tableFor2: 0,
            tableFor4: 0,
            tableFor6: 1,
            showDetails: false,
        },
        { 
            code: 'R025', 
            date: '2023-10-02', 
            time: '6:30 PM', 
            duration: 1, 
            status: 'Confirmed', 
            customerName: 'Amelia King', 
            people: 4,
            tableFor2: 0,
            tableFor4: 1,
            tableFor6: 0,
            showDetails: false,
        }
    ]);

    // Sort bookings based on nearest upcoming slot
    const sortBookings = (list) => {
        return list.sort((a, b) => {
            const aDate = new Date(`${a.date} ${a.time}`);
            const bDate = new Date(`${b.date} ${b.time}`);
            return aDate - bDate;
        });
    };

    const handleTerminate = (code) => {
        setBookings((prev) => {
            const updatedBookings = prev.map((booking) => {
                if (booking.code === code) {
                    return {
                        ...booking,
                        status: booking.status === 'Confirmed' ? 'Serviced' : booking.status,
                        terminated: true,
                    };
                }
                return booking;
            });

            const [terminatedSlot] = updatedBookings.filter((booking) => booking.code === code);
            const remainingSlots = updatedBookings.filter((booking) => booking.code !== code);
            return [...remainingSlots, terminatedSlot];
        });
    };

    const toggleExtraDetails = (code) => {
        setBookings((prev) => {
            return prev.map((booking) => {
                if (booking.code === code) {
                    return {
                        ...booking,
                        showDetails: !booking.showDetails, // Toggle visibility
                    };
                }
                return booking;
            });
        });
    };

    useEffect(() => {
        setBookings((prev) => sortBookings(prev));
    }, []);

    return (
        <div className="reservation-system">
            <div className="hero fade-in">
                <h1>Owner Onlooker</h1>
            </div>
            <div className="reservations fade-in">
                <div className="reservation-box">
                    <h2>Bookings</h2>
                    <ul>
                        {bookings.map((booking) => (
                            <li key={booking.code} className={booking.status.toLowerCase()}>
                                <div className="reservation-header">
                                    <span>Code: {booking.code}</span>
                                    <span>Date: {booking.date}</span>
                                    <span>Time: {`${booking.time} (Duration: ${booking.duration} hr)`}</span>
                                    <span className={`status ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                    {!booking.terminated && (
                                        <button
                                            className="terminate-btn"
                                            onClick={() => handleTerminate(booking.code)}
                                        >
                                            slide down
                                        </button>
                                    )}
                                    <button
                                        className="details-toggle-btn"
                                        onClick={() => toggleExtraDetails(booking.code)}
                                    >
                                        {booking.showDetails ? '▲' : '▼'}
                                    </button>
                                </div>

                                {booking.showDetails && (
                                    <div className="extra-details">
                                        <p>Customer Name: {booking.customerName}</p>
                                        <p>Reservation for: {booking.people} people</p>
                                        <p>Table for 2: {booking.tableFor2}</p>
                                        <p>Table for 4: {booking.tableFor4}</p>
                                        <p>Table for 6: {booking.tableFor6}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reservation;
