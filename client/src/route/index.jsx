import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import WelcomePage from "../pages/WelcomePage.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import LoginRoute from "../components/LoginRoute.jsx";

export const router = createBrowserRouter([
    { path : "/",
      element: <App/>,
      children:[
        {
            path : "/",
            element: <Signup/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/welcome", 
            element: <LoginRoute><WelcomePage/></LoginRoute>
        }
      ]  
    }
]);