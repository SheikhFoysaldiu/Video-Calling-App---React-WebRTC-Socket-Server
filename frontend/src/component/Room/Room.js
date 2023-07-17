// Room.js
import React, { useCallback, useContext, useEffect,useRef } from 'react';
import "./Room.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from "../../context/context";


const Room = () => {
  const {
    getUserMediaStream,
    stream,
    remoteStream,
    remoteEmail,
    sendStreamToPeer,
    handleNewUserJoined,
    setRemoteStream,
    remoteVideo,
    setStream
  } = useContext(SocketContext);
  const navigate = useNavigate();
  const handleNewUserJoinedCallback = useCallback((data) => {
    handleNewUserJoined(data);
    console.log("data",data)
  }, [handleNewUserJoined]);

  useEffect(() => {
    window.addEventListener('user:joined', handleNewUserJoinedCallback);
    return () => {
      window.removeEventListener('user:joined', handleNewUserJoinedCallback);
    }
  }, [handleNewUserJoinedCallback]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);


  useEffect(() => {
    sendStreamToPeer();
  }, [sendStreamToPeer, stream]);
 
  const userVideoRef = useRef();
  const remoteVideoRef = useRef();
  
  useEffect(() => {
    if (stream) {
      userVideoRef.current.srcObject = stream;
      console.log("stream",stream)
    }
  }, [stream]);
  useEffect(() => {
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
  
      const user1Element = document.getElementById('user-1');
      const user2Element = document.getElementById('user-2');
      if (user1Element && user2Element) {
        user2Element.style.display = 'block';
        user1Element.classList.add('smallFrame');
      }
    }
  }, [remoteStream]);


  const handleMicToggle = () => {
    const value = stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    if(value)
    {
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
    else
    {
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }
  };

  const handleVideoToggle = () => {
    const value = stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    if(value)
    {
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
    else
    {
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }
    


  }

  const handleLeave = () => {
  setRemoteStream  (null);
  setStream(null);
  navigate('/');

  }

  return (
    <>
 <div id="videos">
        {stream && (
          <video
            id="user-1"
            className="video-player"
            autoPlay
            playsInline
            muted
            ref={userVideoRef}
          />
        )}

        {remoteStream && (
          <video
            className="video-player"
            id="user-2"
            autoPlay
            playsInline
            muted
            ref={remoteVideoRef}
          />
        )}
      </div>

      <div id="controls">
        <div onClick={handleVideoToggle} className="control-container" id="camera-btn">
          <img alt='camera' src={require('../../icons/camera.png')} />
        </div>

        <div onClick={handleMicToggle} className="control-container" id="mic-btn">
          <img alt='camera' src={require('../../icons/mic.png')} />
        </div>

        
          <div onClick={handleLeave} className="control-container" id="leave-btn">
            <img alt='camera' src={require('../../icons/phone.png')} />
          </div>
        
      </div>
    </>
  );
};

export default Room;
