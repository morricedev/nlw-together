import { Route, Switch, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";
import { NotFound404 } from "./pages/NotFound404";

function App() {
  let location = useLocation();
  const transitions = useTransition(location, {
    from: {
      opacity: 0 as any,
      transform: "translate3d(100%,0,0)" as any,
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
    },
    leave: {
      opacity: 0,
      position: "absolute",
      transform: "translate3d(-50%,0,0)",
    },
  });

  return transitions((props, item) => (
    <animated.div style={props}>
      <Switch location={item}>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
        <Route path="/rooms/:id" component={Room} />
        <Route path="/admin/rooms/:id" component={AdminRoom} />
        <Route path="*" component={NotFound404} />
      </Switch>
    </animated.div>
  ));
}

export default App;
