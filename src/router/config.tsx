
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Payment from "../pages/payment/page";
import Admin from "../pages/admin/page";
import Groups from "../pages/groups/page";
import Group from "../pages/group/page";
import Profile from '../pages/profile/page';
import CreateGroup from '../pages/create-group/page';
import Notifications from '../pages/notifications/page';
import Login from '../pages/login/page';
import Register from '../pages/register/page';
import Banking from '../pages/banking/page';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/admin/:groupId",
    element: <Admin />,
  },
  {
    path: "/groups",
    element: <Groups />,
  },
  {
    path: "/group/:groupId",
    element: <Group />,
  },
  {
    path: "/create-group",
    element: <CreateGroup />
  },
  {
    path: "/notifications",
    element: <Notifications />
  },
  {
    path: "/banking",
    element: <Banking />
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: '/profile',
    element: <Profile />
  }
];

export default routes;
