import { createBrowserRouter } from 'react-router-dom';
import Main from '../pages/main/Main';
import CreateHotel from '../pages/CreateHotel/CreateHotel';
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
        path: '*',
        element: <h1>You entered page that do not exist. Please choose different page</h1>,
    },
]);
