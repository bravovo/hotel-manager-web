import { createBrowserRouter } from 'react-router-dom';
import Main from '../pages/main/Main';
import CreateHotel from '../pages/createHotel/CreateHotel';
import Dashboard from '../pages/dashboard/Dashboard';
import LoginHotel from '../pages/loginHotel/LoginHotel';
import ModifyRoom from '../pages/modifyRoom/ModifyRoom';
export const router = createBrowserRouter([
    {
        index: true,
        path: '/',
        element: <Main />,
    },
    {
        path: '/new-hotel',
        element: <CreateHotel />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/modify-room',
        element: <ModifyRoom />,
    },
    {
        path: '/login-hotel',
        element: <LoginHotel />,
    },
    {
        path: '*',
        element: <h1>You entered page that do not exist. Please choose different page</h1>,
    },
]);
