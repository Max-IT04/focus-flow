import { useSelector } from "react-redux";
import { ControlPanel } from "./control-panel/control-panel";
import { Profile } from "./profile/profile";
import styled from "styled-components"

export const Header = () => {
  return (
    <HeaderContainer>
      <ControlPanel />
      <Profile />
    </HeaderContainer>
  )
}
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #2c3e50;
  color: #fff;
`;