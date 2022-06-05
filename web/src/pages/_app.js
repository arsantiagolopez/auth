import { ChakraProvider } from "@chakra-ui/react";
import "../styles/global.css";
import theme from "../theme";
import { DynamicColorMode } from "../utils/DynamicColorMode";

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <DynamicColorMode theme={theme}>
      <Component {...pageProps} />
    </DynamicColorMode>
  </ChakraProvider>
);

export default MyApp;
