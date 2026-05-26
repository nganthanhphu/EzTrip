import React from "react";
import Header from "../components/provider/Header";
import Footer from "../components/provider/Footer";

const ProviderLayout = ({ children }) => {
    return (
        <div className="provider-layout-container d-flex flex-column min-vh-100">
            <Header />
            <main className="main-content-wrapper">{children}</main>
            <Footer />
        </div>
    );
};

export default ProviderLayout;
