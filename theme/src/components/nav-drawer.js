import { Box, Link, Text } from "@primer/components";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "@primer/octicons-react";
import debounce from "lodash.debounce";
import React from "react";
import { useStaticQuery, graphql, Link as GatsbyLink } from "gatsby";
import useSiteMetadata from "../use-site";
import DarkButton from "./dark-button";
import Details from "./details";
import Drawer from "./drawer";
import NavItems from "./nav-items";

export function useNavDrawerState(breakpoint) {
  // Handle string values from themes with units at the end
  if (typeof breakpoint === "string") {
    breakpoint = parseInt(breakpoint, 10);
  }
  const [isOpen, setOpen] = React.useState(false);

  const onResize = React.useCallback(() => {
    if (window.innerWidth >= breakpoint) {
      setOpen(false);
    }
  }, [setOpen, breakpoint]);

  const debouncedOnResize = React.useMemo(() => {
    return debounce(onResize, 250);
  }, [onResize]);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", debouncedOnResize);
      return () => {
        // cancel any debounced invocation of the resize handler
        debouncedOnResize.cancel();
        window.removeEventListener("resize", debouncedOnResize);
      };
    }
  }, [isOpen, debouncedOnResize]);

  return [isOpen, setOpen];
}

function NavDrawer({ isOpen, onDismiss, location, sidebarItems }) {
  const { siteMetadata } = useSiteMetadata();
  const data = useStaticQuery(graphql`
    {
      primerWikiThemeConfig(id: { eq: "gatsby-theme-primer-wiki-config" }) {
        nav {
          title
          url
          items {
            title
            url
          }
        }
      }
    }
  `);

  const navItems = sidebarItems;
  const primerNavItems = data.primerWikiThemeConfig.nav;
  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        bg="auto.gray.9"
        style={{ overflow: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          flex="0 0 auto"
          color="auto.blue.2"
          bg="auto.gray.9"
        >
          <Box>
            <Box
              display="flex"
              py={3}
              pl={4}
              pr={3}
              alignItems="center"
              justifyContent="justify-content"
            >
              <Link as={GatsbyLink} to="/" color="inherit" fontFamily="mono">
                {siteMetadata.title}
              </Link>
              <DarkButton aria-label="Close" onClick={onDismiss}>
                <XIcon />
              </DarkButton>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <PrimerNavItems items={primerNavItems} />
          </Box>
        </Box>
        {navItems.length > 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            flex="1 0 auto"
            color="auto.gray.7"
            bg="auto.gray.0"
          >
            <NavItems location={location} items={navItems} />
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
}

function PrimerNavItems({ items }) {
  return items.map((item, index) => {
    return (
      <Box
        borderStyle="solid"
        key={item.title}
        borderWidth={0}
        borderRadius={0}
        borderTopWidth={index !== 0 ? 1 : 0}
        borderColor="auto.gray.7"
        p={4}
      >
        {item.items ? (
          <Details key={index}>
            {({ open, toggle }) => {
              return (
                <>
                  <summary onClick={toggle} style={{ cursor: "pointer" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text>{item.title}</Text>
                      {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </Box>
                  </summary>
                  <Box display="flex" flexDirection="column" mt={2}>
                    {item.items.map((child) => (
                      <Link
                        key={child.title}
                        href={child.url}
                        py={1}
                        mt={2}
                        fontSize={1}
                        color="inherit"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </Box>
                </>
              );
            }}
          </Details>
        ) : (
          <Link key={index} href={item.url} color="inherit" display="block">
            {item.title}
          </Link>
        )}
      </Box>
    );
  });
}

export default NavDrawer;
