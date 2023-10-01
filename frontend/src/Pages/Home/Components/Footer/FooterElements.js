import styled from "styled-components";
import { Link } from "react-router-dom";

export const FooterContainer = styled.footer`
background: #030d13;
  height: 100%;
`;

export const FooterWrap = styled.div`
  padding: 50px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1100px;
  margin: auto;
`;

export const FooterLinksContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const FooterLinksWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

export const FooterLinkTitle = styled.h1`
  color: #fff;
  font-size: 2.3vw;
  font-weight: 4px;
  font-family: "Montserrat";
  margin-bottom: 30px;
`;
export const SocialMedia = styled.div`
  max-width: 1000px;
  width: 100%;
`;

export const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 25vw;
`;