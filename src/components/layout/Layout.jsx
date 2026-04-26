import { Outlet } from "react-router-dom";
import { Header } from "../header";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
}