import React,{useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import useSocket from '../socket';

const ToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  padding: 10px;
`; 
const SingleToast = styled.div`
  background: #221D23;
  border: 1px solid #e4cb4f;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  margin-bottom: 5px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateX(${props => props.visible ? '0px' : '100px'  });
`;

const Toast = () => {
  const socket = useSocket();
  const [toast, setToast] = useState(false);
  let timeout = useRef(null);

  useEffect(() => {
    socket.on('notify', (data) => {
      setToast(data);
      if (timeout.current) {
       clearTimeout(timeout.current);
      }
     timeout.current = setTimeout(() => {
      setToast(false)
     }, 2000)
    })
  }, [])


  return <ToastContainer>
     <SingleToast visible={!!toast}>{toast ? toast : ''}</SingleToast>
  </ToastContainer>

}
export default Toast;