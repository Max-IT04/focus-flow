import { selectUser } from "../../../store/slices/user-slice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #fff;
`;

const UserName = styled.span`
  font-size: 16px;
`;

export const Profile = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const getInitials = () => {
    return user?.login?.charAt(0).toUpperCase() || "?";
  };

  const handleClick = () => {
    navigate("/settings");
  };

  return (
    <ProfileContainer onClick={handleClick}>
      <UserName>{user?.login || "Пользователь"}</UserName>
      <Avatar>{getInitials()}</Avatar>
    </ProfileContainer>
  )
}