import React, { useState } from "react";
import GennotateContext from "./gennotateContext";

const GennotateState = (props) =>{
    const host = 'http://127.0.0.1:8000'
    const [authentication, setAuthentication] = useState('Login')
    const [seeLoginPassword, setSeeLoginPassword] = useState(true)
    const [seeSignUpPassword, setSeeSignUpPassword] = useState(true)
    const [seeSignUpConfirmPassword, setSeeSignUpConfirmPassword] = useState(true)
    const [user, setUser] = useState({})
    const [authenticationMsg, setAuthenticationMsg] = useState('No Text')
    const [authenticateAlert, setAuthenticateAlert] = useState(false)
    const [generateAlert, setGenerateAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [openNav, setOpenNav] = useState(true)
    const [handleNavbar1, setHandleNavbar1] = useState(0)
    const [handleNavbar2, setHandleNavbar2] = useState(1)
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = React.useState(false);
    const [selected, setSelected] = useState(0)
    const [temp, setTemp] = useState({ id: 1, link: '', type: 0 });
    const [temp2, setTemp2] = useState([]);
    const [file, setFile] = useState(null)
    const handleOpenModal = () => {
      setOpenModal(true);
    };
    const handleCloseModal = () => {
      setOpenModal(false);
    };
    function hasOnlySpacesAndAlphabets(inputString) {
      const regex = /^[a-zA-Z\s]+$/;
      return regex.test(inputString);
    }
    function isUsernameValid(username) {
      const regex = /^[a-z0-9_]+$/;
      return regex.test(username);
    }
    const login = (obj) => {
        fetch(`${host}/api/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((responseData) => {
          if (responseData.token) {
            setUser(responseData.user)
            setAuthenticationMsg('Success')
            getGeneratedImages({ userId: responseData.user.id })
            getSegmentedImages({ userId: responseData.user.id })
          } else {
            setAuthenticationMsg('wrong username or password')
            setAuthenticateAlert(true);
          }
        })
        .catch((error) => {
          setAuthenticationMsg('Unfortunately! we are having server error. Kindly try again after some time ')
          setAuthenticateAlert(true);
        });
    };
    const signup = (obj) => {
      fetch(`${host}/api/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData.token) {
          setUser(responseData.user)
          setAuthenticationMsg('Success')
          setTemp2([])
        } else {
          setAuthenticationMsg('username already taken')
          setAuthenticateAlert(true)
        }
      })
      .catch((error) => {
        console.error('Error:', error.message || 'An error occurred.');
        setAuthenticationMsg('internal server error')
      });
    };
    const generateImages = (obj, startTime) => {
      fetch('http://127.0.0.1:8000/generateImages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData.message === "Data added to the database") {
          const endTime = performance.now()
          const totalTime = (endTime - startTime)/1000          
          setAlertMsg(`Images generated in ${totalTime.toFixed(2)} seconds. Go to gallery to see the generated images`)
          setGenerateAlert(true)
          getGeneratedImages({ userId: user.id })
        }
      })
      .catch((error) => {
        console.log('Error:', error.message || 'An error occurred.');
        setAlertMsg('Unfortunately! we are having server error. Kindly try again after some time')
        setGenerateAlert(true)
      });
    };
    const getGeneratedImages = (obj) => {
      fetch(`http://127.0.0.1:8000/getGeneratedImages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData.generated_images)
        setData(responseData.generated_images)
      })
      .catch((error) => {
        console.log('Error:', error.message || 'An error occurred.');
      });
    };
    const getSegmentedImages = (obj) => {
      fetch(`http://127.0.0.1:8000/getSegmentedImages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData)
        setData2(responseData.segmented_images);
        if (responseData.segmented_images.length > 0) {
          setTemp2([responseData.segmented_images[responseData.segmented_images.length - 1]])
          console.log([responseData.segmented_images[responseData.segmented_images.length - 1]])
        }
      })
      .catch((error) => {
        console.log('Error:', error.message || 'An error occurred.');
      });
    };
    const segmentImages = (obj) => {
      fetch(`http://127.0.0.1:8000/segmentedImages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData)
        getSegmentedImages({ userId: user.id })
      })
      .catch((error) => {
        console.log('Error:', error.message || 'An error occurred.');
      });
    };
    const cleanImages = (userId) => {
      const formData = new FormData();
      formData.append('file', file);
      fetch(`http://127.0.0.1:8000/cleanImages/?userId=${userId}`, {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        // Mission Completed!
        if (responseData.message === "Mission Completed!") {        
          getGeneratedImages({ userId: user.id })
        }
      })
      .catch((error) => {
        console.log('Error:', error.message || 'An error occurred.');
      });
    };    
    return(
        <GennotateContext.Provider value={{ authentication, setAuthentication, seeLoginPassword, setSeeLoginPassword, seeSignUpPassword, setSeeSignUpPassword, seeSignUpConfirmPassword, setSeeSignUpConfirmPassword, login, user, authenticationMsg, setAuthenticationMsg, signup, hasOnlySpacesAndAlphabets, isUsernameValid, generateAlert, setGenerateAlert, alertMsg, setAlertMsg, generateImages, authenticateAlert, setAuthenticateAlert, openNav, setOpenNav, handleNavbar1, setHandleNavbar1, handleNavbar2, setHandleNavbar2, data, setData, getGeneratedImages, openModal, handleOpenModal, handleCloseModal, selected, setSelected, temp, setTemp, segmentImages, getSegmentedImages, data2, setData2, temp2, setTemp2, file, setFile, cleanImages, setUser, open, setOpen }}>
            {props.children}
        </GennotateContext.Provider>
    )
}
export default GennotateState;