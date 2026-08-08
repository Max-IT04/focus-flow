import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`; 

const StyledLinkHeader = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ControlPanel = () => {
  return (
    <Nav>
      <StyledLinkHeader to="/">Главная</StyledLinkHeader>
      <StyledLinkHeader to="/projects">Проекты</StyledLinkHeader>
      <StyledLinkHeader to="/analytics">Аналитика</StyledLinkHeader>
    </Nav>
  )
};