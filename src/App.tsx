/* eslint-disable @typescript-eslint/no-explicit-any */
import Login from "./auth/Login";
import  './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

import HereSection from "./components/HereSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/Success";
import { useUserStore } from "./store/useUserStore";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";

export const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  console.log("ProtectedRoutes: isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoutes: user:", user);
  if (!isAuthenticated) {
    console.log("Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if(isAuthenticated && user){
    return <Navigate to="/profile" replace/>
  }
  return children;
};

const AdminRoute = ({children}:{children:React.ReactNode}) => {
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user?.admin){
    return <Navigate to="/" replace/>
  }

  return children;
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        path: "/",
        element: <HereSection />,
      },
      {
        path: "/profile",
        element:<ProtectedRoutes><Profile /></ProtectedRoutes> ,
      },
      {
        path: "/search/:text",
        element:<ProtectedRoutes><SearchPage /></ProtectedRoutes> ,
      },
      {
        path: "/restaurant/:id",
        element:<ProtectedRoutes><RestaurantDetail /></ProtectedRoutes> ,
      },
      {
        path: "/cart",
        element:<ProtectedRoutes><Cart /></ProtectedRoutes> ,
      },
      {
        path: "/order/status",
        element:<ProtectedRoutes><Success /></ProtectedRoutes> ,
      },
      // admin services start from here
      {
        path: "/admin/restaurant",
        element:<AdminRoute><Restaurant /></AdminRoute>,
      },
      {
        path: "/admin/menu",
        element:<AdminRoute><AddMenu /></AdminRoute>,
      },
      {
        path: "/admin/orders",
        element:<AdminRoute><Orders /></AdminRoute>,
      },
    ],
  },
  {
    path: "/login",
    element:<AuthenticatedUser><Login /></AuthenticatedUser>,
  },
  {
    path: "/signup",
    element:<AuthenticatedUser><Signup /></AuthenticatedUser> ,
  },
  {
    path: "/forgot-password",
    element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser>,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  }
]);

function App() {
  const initializeTheme = useThemeStore((state:any) => state.initializeTheme);
  const {checkAuthentication, isCheckingAuth} = useUserStore();
  // checking auth every time when page is loaded
  useEffect(()=>{
    checkAuthentication();
    initializeTheme();
  },[checkAuthentication])

  if(isCheckingAuth) return <Loading/>
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;