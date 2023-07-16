// Room.js
import React, { useCallback, useContext, useEffect,useRef } from 'react';
import "./Room.css";
import { Link } from 'react-router-dom';
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
    remoteVideo
  } = useContext(SocketContext);

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

    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream) {
 
      remoteVideoRef.current.srcObject = remoteStream;
      document.getElementById('user-2').style.display = 'block';
      document.getElementById('user-1').classList.add('smallFrame');
     
    }
  }, [remoteStream]);
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
        <div className="control-container" id="camera-btn">
          <img alt='camera' src={require('../../icons/camera.png')} />
        </div>

        <div className="control-container" id="mic-btn">
          <img alt='camera' src={require('../../icons/mic.png')} />
        </div>

        <Link to="/">
          <div className="control-container" id="leave-btn">
            <img alt='camera' src={require('../../icons/phone.png')} />
          </div>
        </Link>
      </div>
    </>
  );
};

export default Room;
