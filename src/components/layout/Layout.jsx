import { Outlet } from "react-router-dom";
import { Header } from "../header";
import styled from "styled-components";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  // overflow-y: auto;
  max-width: 1400px;
  marhin: 0 auto;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
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