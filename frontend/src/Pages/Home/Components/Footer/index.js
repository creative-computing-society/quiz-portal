import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebook,faLinkedin,faYoutube,faInstagram,faDiscord} from "@fortawesome/free-brands-svg-icons"

import './footer.css'
import {FooterContainer,FooterWrap,FooterLinksContainer,FooterLinksWrapper,FooterLinkTitle} from './FooterElements'
import{SocialIcons,SocialMedia} from './FooterElements'

function Footer(){
    return (
        <FooterContainer>
        <FooterWrap>
        <FooterLinksContainer>
        <FooterLinksWrapper>
        
             <FooterLinkTitle>Connect With Us 
             </FooterLinkTitle>
            
        
        </FooterLinksWrapper></FooterLinksContainer>
        <FooterLinksWrapper>
        
        
              
                 <SocialIcons>
                 <a style={{color:"white"}} className="social-button facebook" href="https://www.facebook.com/CCSTU/?ref=br_rs" target="_blank"><FontAwesomeIcon className="icons" icon={faFacebook} /></a>
                 <a style={{color:"white"}} className="social-button linkedin" href="https://www.linkedin.com/company/ccs-tiet/" target="_blank"><FontAwesomeIcon  className="icons" icon={faLinkedin} /></a>
                 <a style={{color:"white"}} className="social-button youtube" href="https://youtube.com/channel/UCc-F6rlsDdHAKfSiPJEnDLg" target="_blank"><FontAwesomeIcon  className="icons" icon={faYoutube} /></a>
                 <a style={{color:"white"}} className="social-button instagram" href="http://instagram.com/ccs_tiet?utm_source=qr" target="_blank"><FontAwesomeIcon  className="icons" icon={faInstagram} /></a>
                 </SocialIcons>
                
      
        </FooterLinksWrapper></FooterWrap></FooterContainer>
    )
}

export default Footer