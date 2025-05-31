const LoadingBouncer = ({ message = "Loading" }) => {
    return (
        <div className="flex items-center justify-center min-h-[200px] text-dark">
            <div className="flex flex-col items-center space-y-4">
                <p className="text-xl font-medium text-dark">{message}</p>
                <div className="flex space-x-2">
                    <span className="dot bg-mainBlue delay-0" />
                    <span className="dot bg-mainOrange delay-1" />
                    <span className="dot bg-mainBlue delay-2" />
                    <span className="dot bg-mainOrange delay-3" />
                    <span className="dot bg-mainBlue delay-4" />
                </div>
            </div>
        </div>
    );
};

export default LoadingBouncer;
