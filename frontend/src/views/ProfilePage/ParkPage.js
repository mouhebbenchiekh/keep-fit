import React, { useContext, useEffect ,useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons


import EventIcon from '@material-ui/icons/Event';
import MapIcon from '@material-ui/icons/Map';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";

import profile from "assets/img/football.jpg";

import studio1 from "assets/img/examples/studio-1.jpg";
import studio2 from "assets/img/examples/studio-2.jpg";
import studio3 from "assets/img/examples/studio-3.jpg";
import studio4 from "assets/img/examples/studio-4.jpg";
import studio5 from "assets/img/examples/studio-5.jpg";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

//schedule dependencies 
import { ViewState ,EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  EditRecurrenceMenu,
  ConfirmationDialog,
  
} from '@devexpress/dx-react-scheduler-material-ui';
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Context } from "Reducer/Store";

const currentDate = "2022-10-16";
const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

const useStyles = makeStyles(styles);

function createData(props){
  var date = new Date(props.reservationFrom)
  var date2 = new Date(props.reservationFrom);
  
  date2.setHours(date2.getHours()+1);
  date2.setMinutes(date2.getMinutes()+30);
  //date2=date2.setMinutes(date.getMinutes()+30);
  console.log(date,"hhhhhh",date2);
  return {startDate: date,endDate:date2,title:props.reservationStatus}

}



export default function ParkPage(props) {

  let {ID}=useParams();
  let {IDF}=useParams();
  const [court,setCourt]=useState();
  const [facility,setFacility]=useState();
  const [reservations,setReservation]=useState([]);
  const [schedulerData,setData]=useState([]);
  const [addedAppointment,setAdd]=useState({});
  const [state,dispatch]=useContext(Context);

  const changeAddedAppointment=(added)=> {
    console.log(added);
            setAdd( added );
  }

 const  commitChanges=(/*{ added, changed, deleted }*/)=> {

 
      let list=schedulerData;
      console.log(addedAppointment);
      let createAp ={startDate:addedAppointment.startDate,endDate:addedAppointment.endDate,title:"pending"}  ;
      console.log(createAp) ;
      list.push(createAp);  

        setData( list);
        if (state.user){
          const body={
            user:state.user._id,
            reservation:{
              reservationFrom:createAp.startDate,
              court:ID
            }
          }
        
       axios.post(`http://localhost:5000/facility/reservation/${IDF}`,JSON.stringify(body),{headers:{
        "Content-Type":"application/json"
      }}).then(result=>{
        console.log("new reservation ",result)
        let list = reservations.push(result.data.reservation);
        setReservation(list);
      }).catch(err=>console.log(err))
        }
        console.log(schedulerData);
      
     
    };

    useEffect(()=>{console.log("reservation chnaged hhhhhhhh")},[schedulerData,reservations]);
  

  useEffect(
    ()=>{
      axios.get(`http://localhost:5000/facility/facility/${IDF}`,{headers:{
        "Content-Type":"application/json"
      }}).then(
        res=>setFacility(res.data)
      ).catch(err=>console.log(err))

      axios.get(`http://localhost:5000/facility/court/${ID}`,{headers:{
        "Content-Type":"application/json"
      }}).then(
        res=>setCourt(res.data)
      ).then(
        axios.get(`http://localhost:5000/facility/reservations/court/${ID}`,{headers:{
          "Content-Type":"application/json"
        }}).then(result=>{setReservation(result.data)
        console.log(result)
        return result.data
      }
              
        ).then((data)=>{
          let list=[];
          data.map(reser=>{
            list.push(createData(reser))
          })
          setData(list);
        })
      ).catch(err=>console.log(err))

    },[]
  )
  const classes = useStyles();
  const { ...rest } = props;
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <div>
      <Header
        color="transparent"
        brand="KEEP FIT"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div>
                    <img src={profile} alt="..." className={imageClasses} />
                  </div>
                  <div className={classes.name}>
                    <h3 className={classes.title}>{court?court.courtIdentifier:"nth"}</h3>
                    <h5 style={{color:"green"}}>Price: 80dt</h5>
                    <h6>{court?court.description:"nth"}</h6>
                    <Button justIcon link className={classes.margin5}>
                      <i className={"fab fa-twitter"} />
                    </Button>
                    <Button justIcon link className={classes.margin5}>
                      <i className={"fab fa-instagram"} />
                    </Button>
                    <Button justIcon link className={classes.margin5}>
                      <i className={"fab fa-facebook"} />
                    </Button>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description}>
              <p>
                An artist of considerable range, Chet Faker — the name taken by
                Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs
                and records all of his own music, giving it a warm, intimate
                feel with a solid groove structure.{" "}
              </p>
              
             
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                <NavPills
                  alignCenter
                  color="primary"
                  tabs={[
                    {
                      tabButton: "Photos",
                      tabIcon: PhotoLibraryIcon,
                      tabContent: (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={4}>
                            <img
                              alt="..."
                              src={studio1}
                              className={navImageClasses}
                            />
                            <img
                              alt="..."
                              src={studio2}
                              className={navImageClasses}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4}>
                            <img
                              alt="..."
                              src={studio5}
                              className={navImageClasses}
                            />
                            <img
                              alt="..."
                              src={studio4}
                              className={navImageClasses}
                            />
                          </GridItem>
                        </GridContainer>
                      )
                    },
                    {
                      tabButton: "Schedule",
                      tabIcon: EventIcon,
                      tabContent: (
                        <GridContainer justify="center">
                          
                          <Scheduler
                            data={schedulerData}
                          >
                            <ViewState
                              currentDate={currentDate}
                            />
                            <EditingState
                              onCommitChanges={()=>{commitChanges()}}
                              addedAppointment={addedAppointment}
                              onAddedAppointmentChange={(added)=>changeAddedAppointment(added)}
                             
                            />
                            <WeekView
                              startDayHour={9}
                              endDayHour={23}
                              cellDuration={90}
                            />
                             <EditRecurrenceMenu />
                              <ConfirmationDialog />
                            <Appointments />
                           <AppointmentForm />
                    
                      </Scheduler>
                        </GridContainer>
                      )
                    },
                    {
                      tabButton: "Location",
                      tabIcon: MapIcon,
                      tabContent: (
                        <GridContainer justify="center">
                          <div style={{position:"relative",textAlign:"right",height:"500px",width:"600px"}}>
                            <div  style={{overflow:"hidden",background:"none!important",height:"500px",width:"600px"}}>
                              <iframe width="600" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=manouba&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                              <a href="https://123movies-to.org"></a><br/><a href="https://www.embedgooglemap.net">how to embed google maps into html</a></div></div>
                        </GridContainer>
                      )
                    }
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
