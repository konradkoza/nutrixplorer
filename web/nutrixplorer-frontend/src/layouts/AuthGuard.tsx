import { RootState } from "@/redux/store";
import { AccessLevel } from "@/types/UserTypes";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

type AuthGuardProps = {
    requiredRole: AccessLevel;
};

const AuthGuard = ({ requiredRole }: AuthGuardProps) => {
    const { token, accessLevels } = useSelector((state: RootState) => state.authSlice);
    if (token && accessLevels.includes(requiredRole)) {
        return <Outlet></Outlet>;
    } else {
        return <Navigate to="/login" replace={true} />;
    }
};

export default AuthGuard;
