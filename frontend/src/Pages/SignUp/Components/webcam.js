import React, { useState } from 'react'
import Webcam from 'react-webcam'
import styles from "../Style/leftContainer.module.css";


const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}
const Profile = (props) => {
  const [picture, setPicture] = useState('')
  const webcamRef = React.useRef(null)
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot()
    setPicture(pictureSrc)
    props.func(pictureSrc);
  })
  return (
    <div>
      <div>
        {picture == '' ? (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{borderRadius:"13px",margin:"5% 0% 2.5% 0%"}}
          />
        ) : (
          <img src={picture} style={{borderRadius:"13px",margin:"5% 0% 2.5% 0%"}} />
        )}
      </div>
      <div>
        {picture != '' ? (
          <button
            onClick={(e) => {
              e.preventDefault()
              setPicture('')
            }}
            className={styles.captureBtn}
          >
            Retake
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault()
              capture()
            }}
            className={styles.captureBtn} >
            Capture
          </button>
        )}
      </div>
    </div>
  )
}
export default Profile