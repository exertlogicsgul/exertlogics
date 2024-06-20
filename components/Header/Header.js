import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Scrollspy from "react-scrollspy";
import logoPlaceholder from 'public/images/el-logo.png'; // Placeholder in case of a failed fetch

// import logo from "public/images/el-logo.png";
import brand from "public/text/brand";
import routeLink from "public/text/link";
import Link from "../Link";
import MobileMenu from "./MobileMenu";
import Settings from "./Settings";
import useStyles from "./header-style";

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) {
  return <AnchorLink to={props.href.replace("#", "")} {...props} />;
});

function Header(props) {
  // Theme breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Scroll and Fixed Menu
  const [fixed, setFixed] = useState(false);
  let flagFixed = false;
  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagFixed = scroll > 80;
    if (flagFixed !== newFlagFixed) {
      setFixed(newFlagFixed);
      flagFixed = newFlagFixed;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch menu data from API
  const [menuList, setMenuList] = useState([]);
  const [logoUrl, setLogoUrl] = useState(logoPlaceholder);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/header/");
        const data = await response.json();
        if (data.status === "success" && data.header.length > 0) {
          const links = data.header[0].links.map((link) => ({
            name: link.title,
            url: link.url,
            offset: 200,
          }));
          setMenuList(links);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);


   useEffect(() => {
     async function fetchLogoData() {
       try {
         const logoResponse = await fetch("http://localhost:3001/api/logo/");
         const logoData = await logoResponse.json();
         if (logoData.status === "success" && logoData.logos.length > 0) {
           setLogoUrl(logoData.logos[0].logoLightUrl);
         }
       } catch (error) {
         console.error("Error fetching logo:", error);
       }
     }
     fetchLogoData();
   }, []);



  const { classes, cx } = useStyles();
  const { onToggleDark, onToggleDir, invert } = props;

  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <Fragment>
      {isMobile && (
        <MobileMenu open={openDrawer} toggleDrawer={handleOpenDrawer} />
      )}
      <AppBar
        component="div"
        position="relative"
        id="header"
        className={cx(
          classes.header,
          fixed && classes.fixed,
          openDrawer && classes.openDrawer
        )}
      >
        <Container>
          <div className={classes.headerContent}>
            <nav className={cx(classes.navLogo, invert && classes.invert)}>
              {isMobile && (
                <IconButton
                  onClick={handleOpenDrawer}
                  className={cx(
                    "hamburger hamburger--spin",
                    classes.mobileMenu,
                    openDrawer && "is-active"
                  )}
                  size="large"
                >
                  <span className="hamburger-box">
                    <span className={cx(classes.bar, "hamburger-inner")} />
                  </span>
                </IconButton>
              )}
              <div className={classes.logo}>
                {invert ? (
                  <Link className="site-name" href={routeLink.agency.home}>
                    <img src={logoUrl} alt="logo" />
                    {brand.agency.name}
                  </Link>
                ) : (
                  <AnchorLink className="site-name" href="#home">
                    <img src={logoUrl} alt="logo" />
                    {brand.agency.name}
                  </AnchorLink>
                )}
              </div>
            </nav>
            <nav
              id="header-nav"
              className={cx(classes.navMenu, invert && classes.invert)}
            >
              {isDesktop && (
                <Scrollspy
                  items={menuList.map((item) => item.name)}
                  currentClassName="active"
                >
                  {menuList.map((item, index) => (
                    <li key={index}>
                      {invert ? (
                        <Button component={Link} href={item.url}>
                          {item.name}
                        </Button>
                      ) : (
                        <Button
                          component={LinkBtn}
                          href={item.url}
                          offset={item.offset}
                        >
                          {item.name}
                        </Button>
                      )}
                    </li>
                  ))}
                </Scrollspy>
              )}
              <Settings
                toggleDark={onToggleDark}
                toggleDir={onToggleDir}
                invert={invert}
              />
            </nav>
          </div>
        </Container>
      </AppBar>
    </Fragment>
  );
}

Header.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
  invert: PropTypes.bool,
};

Header.defaultProps = {
  invert: false,
};

export default Header;
