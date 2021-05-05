import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';

// @material-ui/icons

import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import SportsIcon from '@material-ui/icons/Sports';
import MapIcon from '@material-ui/icons/Map';


// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";

import profile from "assets/img/faces/oxygene.png";

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
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2018-11-01';
const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

const useStyles = makeStyles(styles);

export default function GymPage(props) {
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
                    <h3 className={classes.title}>Oxygene GYM</h3>
                    <h5 style={{color:"green"}}>Price: 80dt</h5>
                    
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
                      tabButton: "Activities",
                      tabIcon: SportsIcon,
                      tabContent: (
                        <GridContainer justify="center">
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4} lg={2}>
                            <Chip label="Musculation" style={{marginTop:"10px"}}/>
                          </GridItem>
                         
                          
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
