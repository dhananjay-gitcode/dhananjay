import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { LoginPage, App } from "../components";
import { ThemeComponent } from "../components";


export default function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <LoginPage />
      {/* <ThemeComponent/> */}
      {/* <Hello/> */}
      {/* <App /> */}
    </>
  );
}
