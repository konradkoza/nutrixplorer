import { RootState } from "@/redux/store";
import { AccessLevel } from "@/types/UserTypes";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

type AuthGuardProps = {
    requiredRoles: AccessLevel[];
};

const AuthGuard = ({ requiredRoles }: AuthGuardProps) => {
    const { token, accessLevels } = useSelector((state: RootState) => state.authSlice);
    const hasAccess = requiredRoles.some((role) => accessLevels.includes(role));

    if (token && hasAccess) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace={true} />;
    }
};

export default AuthGuard;
