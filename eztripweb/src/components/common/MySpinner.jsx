import { Spinner } from "react-bootstrap";

const MySpinner = ({ className = "" }) => {
    return (
        <div className={`d-flex justify-content-center align-items-center ${className}`}>
            <Spinner animation="grow" variant="primary" className="p-2" />
        </div>
    );
};

export default MySpinner;
