import React, { useState } from "react";

import axios from "axios";
import styles from "../Style/leftContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import logo from "../Assets/black-logo.png";
import { api_url } from "../../../config";
import ImageCaptureForm from "./webcam";

const url = api_url + "/users/signup";

const LeftContainer = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [aNumber, setAnumber] = useState("");
  const [techStack, setTechStack] = useState("");
  const [links, setLinks] = useState("");
  const [message, setMessage] = useState("");
  const [nonTech, setNonTech] = useState([]);
  const [nonTechLinks, setNonTechLinks] = useState("")
  const [imageURL, setImage] = useState("")
  // const [nonTech, setNonTech] = useState({
    //   "Marketing": false,
    //   "Content Writing": false,
    //   "Designing": false,
    //   "Video Editing": false
    // });
  const [pic, setpic] = useState(false);

  const [button, setButton] = useState(
    <button type="submit" className={styles.button}>
      <div>Submit</div>
      <div className={styles.arrow}>&rarr;</div>
    </button>
  );

    const handleCheck = (e) => {
      // console.log(e.target.checked);

      const {checked, value} = e.target;

      if(checked) {
        setNonTech(prev => (
          [...prev, value]
        ))
      }else {
        setNonTech(prev => prev.filter((e) => e!==value))
      }
      console.log(nonTech)
    }



  const submitForm = async (e) => {
    e.preventDefault();

    if (name && email && number && branch && aNumber &&imageURL) { 
      setButton(
        <button type="submit" className={styles.button} disabled>
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </button>
      );
      try {
        const resp = await axios.post(url, {
          name: name,
          email: email.trim(),
          phoneNumber: number,
          branch: branch,
          applicationNumber: aNumber,
          techStack: techStack,
          links: links,
          nonTechFields: nonTech.toString(),
          nonTechLinks: nonTechLinks,
          image: imageURL,
        });
        // console.log(resp.data);
        setName("");
        setEmail("");
        setNumber("");
        setBranch("");
        setAnumber("");
        setTechStack("");
        setLinks("");
        setMessage("");
        setNonTech([]);
        setImage("");
        const checklist = document.getElementsByTagName("input");
        for (const element of checklist) {
          element.checked = false;
        }

        setNonTechLinks("");
        setButton(
          <button type="submit" className={styles.button} disabled>
            <div>Registered!</div>
          </button>
        );
      } catch (error) {
        // console.log(error.response.data.error);
        const err_message = error.response.data.error;
        // console.log(err_message.split(" ")[0])
        if(err_message.split(" ")[0] == "E11000"){
          setMessage("User already exists");
        }else {
          setMessage("An error occurred")
        }
        // error.response.data.error == ""
        
        setButton(
          <button type="submit" className={styles.button}>
            <div>Submit</div>
            <div className={styles.arrow}>&rarr;</div>
          </button>
        );
      }

      // console.log(name, email);
    } else {
      alert("Please fill in all the data");
    }
  };

  return (
    <div className={styles.leftContainer}>
      <img src={logo} alt="ccs-logo" className={styles.logo} />
      <h3 className={styles.heading}>Register Here</h3>
      <form
        action=""
        onSubmit={submitForm}
        className={styles.leftContainerForm}
      >
        <input
          type="text"
          name="name"
          id="name"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name *"
          className={styles.inputBox}
        />
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email *"
          className={styles.inputBox}
        />
        <input
          type="number"
          name="phone"
          id="pnumber"
          autoComplete="off"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Phone Number *"
          className={styles.inputBox}
        />
        <input
          type="text"
          name="branch"
          id="branch"
          autoComplete="off"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="Branch *"
          className={styles.inputBox}
        />
        <input
          type="text"
          name="aNumber"
          id="anumber"
          autoComplete="off"
          value={aNumber}
          onChange={(e) => setAnumber(e.target.value)}
          placeholder="Roll Number *"
          className={styles.inputBox}
        />
        <input
          type="text"
          name="techStack"
          id="techStack"
          autoComplete="off"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="Tech Stack"
          className={styles.inputBox}
        />
        <input
          type="text"
          name="links"
          id="links"
          autoComplete="off"
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="Links (Github, Codechef, etc.)"
          className={styles.inputBox}
        />

        <button type="button" className={styles.captureBtn} onClick={()=>{setpic(!pic)}}>Capture your pic(full face).</button>
        <div className="container mt-5">
          {pic&&(
            <ImageCaptureForm  func={(imgURL)=>{setImage(imgURL);console.log(imgURL);}}/>
          )} 
        </div>
        <div className={styles.checkboxes}>
          <div className={styles.checkHeading}>Select the Non-Tech fields you wish to contribute to (if any)</div>
          <div className={styles.check}>
            <input
              type="checkbox"
              name="nonTechDomain"
              id="marketing"
              value="Marketing"
              onChange={handleCheck}
            />
            <label htmlFor="marketing">Marketing</label>
          </div>
          <div className={styles.check}>
            <input
              type="checkbox"
              name="nonTechDomain"
              id="contentWriting"
              value="Content Writing"
              onChange={handleCheck}
            />
            <label htmlFor="contentWriting">Content Writing</label>
          </div>
          <div className={styles.check}>
            <input
              type="checkbox"
              name="nonTechDomain"
              id="designing"
              value="Designing"
              onChange={handleCheck}
            />
            <label htmlFor="designing">Designing</label>
          </div>
          <div className={styles.check}>
            <input
              type="checkbox"
              name="nonTechDomain"
              id="videoEditing"
              value="Video Editing"
              onChange={handleCheck}
            />
            <label htmlFor="videoEditing">Video Editing</label>
          </div>
        </div>
        <input
          type="text"
          name="nonTechLinks"
          id="nonTechLinks"
          autoComplete="off"
          value={nonTechLinks}
          onChange={(e) => setNonTechLinks(e.target.value)}
          placeholder="Link to any Non-Tech work"
          className={styles.inputBox}
        />
        {button}
        <small>{message}</small>
      </form>
    </div>
  );
};

export default LeftContainer;
