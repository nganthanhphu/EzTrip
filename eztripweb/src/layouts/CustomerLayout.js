import React from "react";
import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";

const CustomerLayout = ( {children} ) => {
    return (
        <div className="customer-layout-container d-flex flex-column min-vh-100">
            <Header />
            <main className="main-content-wrapper">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default CustomerLayout;
