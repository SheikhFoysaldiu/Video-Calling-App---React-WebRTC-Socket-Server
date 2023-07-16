// context.js
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ]
};

const socket = io('http://192.168.0.106:8000');

const constraint = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
  audio: true
};

const peer = new RTCPeerConnection(servers);

const ContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [remoteEmail, setRemoteEmail] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const userVideo = useRef();
  const remoteVideo = useRef();

  const JoinRoom = useCallback(({ roomID, emailID }) => {
    socket.emit('room:join', { roomID, emailID });
  }, []);

  const handleJoinRoom = useCallback((data) => {
    const { roomID } = data;
    navigate(`/room/${roomID}`);
  }, [navigate]);

  const handleNewUserJoined = useCallback(async (data) => {
    const { emailID } = data;
    const offer = await createOffer();
    socket.emit('send-offer', { offer, emailID });
    setRemoteEmail(emailID);
  }, []);

  const handleIncomingOffer = useCallback(async (data) => {
    const { offer, from } = data;
    console.log("offer", offer);
    const answer = await createAnswer(offer);
    socket.emit('send-answer', { answer, emailID: from });
    setRemoteEmail(from);
  }, []);

  const handleIncomingAnswer = useCallback(async (data) => {
    const { answer } = data;
    console.log("answer", answer);
    await setRemoteAnswer(answer);
  }, []);

  const handleTrackEvent = useCallback((event) => {
    setRemoteStream(event.streams[0]);
  }, []);

  const handleNegotiationNeeded = async () => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('send-offer', { offer, emailID: remoteEmail });
    } catch (error) {
      console.error('Error creating or setting local description:', error);
    }
  };

  const getUserMediaStream = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
        console.log(mediaStream);
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing user media:', error);
      }
    } else {
      console.error('getUserMedia is not supported in this browser');
    }
  }, []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    await peer.setRemoteDescription(answer);
  };

  const sendStreamToPeer = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    }
  }, [stream]);

  useEffect(() => {
    peer.addEventListener('track', handleTrackEvent);
    peer.addEventListener('negotiationneeded', handleNegotiationNeeded);
    return () => {
      peer.removeEventListener('track', handleTrackEvent);
      peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
    };
  }, [handleTrackEvent, handleNegotiationNeeded]);

  useEffect(() => {
    socket.on('room:join', handleJoinRoom);
    return () => {
      socket.off('room:join', handleJoinRoom);
    };
  }, [handleJoinRoom]);

  useEffect(() => {
    socket.on('user:joined', handleNewUserJoined);
    socket.on('receive-offer', handleIncomingOffer);
    socket.on('receive-answer', handleIncomingAnswer);
    return () => {
      socket.off('user:joined', handleNewUserJoined);
      socket.off('receive-offer', handleIncomingOffer);
      socket.off('receive-answer', handleIncomingAnswer);
    };
  }, [handleNewUserJoined, handleIncomingOffer, handleIncomingAnswer]);

  return (
    <SocketContext.Provider value={{
      peer,
      socket,
      JoinRoom,
      handleNewUserJoined,
      getUserMediaStream,
      stream,
      remoteStream,
      remoteEmail,
      sendStreamToPeer
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
