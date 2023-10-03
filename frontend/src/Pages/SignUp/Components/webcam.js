import React, { useState, useRef,useEffect } from 'react';
import Webcam from 'react-webcam';
import styles from "../Style/leftContainer.module.css";

const Profile = (props) => {
  const [picture, setPicture] = useState('');
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [availableCameras, setAvailableCameras] = useState([]);
  
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: facingMode,
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
    props.func(pictureSrc);
  });


  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        // If there's only one camera available, disable camera switching
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };
    getAvailableCameras();
  }, []);

  return (
    <div>
      <div>
        {picture === '' ? (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ borderRadius: "13px", margin: "5% 0% 2.5% 0%" }}
          />
        ) : (
          <img src={picture} style={{ borderRadius: "13px", margin: "5% 0% 2.5% 0%" }} alt="captured" />
        )}
      </div>
      
      <div className={styles.buttonHub}>
      {availableCameras.length > 1 && (
        <button type="button" onClick={toggleCamera} className={styles.switchBtn}>
            Switch Camera
          </button>
      )}
        {picture !== '' ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setPicture('');
            }}
            className={styles.clickBtn}
          >
            Retake
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className={styles.clickBtn}
          >
            Capture
          </button>
        )}
        
      </div>
    </div>
  );
};

export default Profile;
