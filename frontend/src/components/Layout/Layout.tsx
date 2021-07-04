import { ReactElement } from "react";
import classes from "./Layout.module.css";

const Layout = ({ children }: { children: ReactElement }) => {
  return <div className={classes.layout}>{children}</div>;
};

export default Layout;
