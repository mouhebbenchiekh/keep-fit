import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';

// @material-ui/icons

import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SportsTennisIcon from '@material-ui/icons/SportsTennis';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';


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
import ScoreTab from "components/Tables/scoreTab";
import axios from "axios";

const currentDate = '2018-11-01';
const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

function createData(team1, team2, flag1, flag2, score) {
    team1=team1+" "+flag1;
    team2=team2+" "+flag2;
  return { team1, team2, score };
}

const rows = [
  createData('Chelsea', 'Man city', "CH", "MC", "0-2"),
  createData('Leeds United', 'Totenham Hotspur ', "LU", "TH", "0-3"),
  createData('Liverpool', 'Southampton', "LV", "SO", "3-2"),
 
];
var rowsLive=[];


const useStyles = makeStyles(styles);

export default function ResultsPage(props) {

  //live matches *******

  const [rowsLive,setRows]=useState([]);
  
  

  useEffect(()=>{
    axios.get('http://api.football-data.org/v2/matches?status=LIVE',{headers :{
      'X-Auth-Token': '2bf2c7bfb63347f8a83a301df17f95d7'
    }}).then(res=>res.data).then(
      data=>{
       const rowsLive1=[];
        data.matches.map(match=>{
          console.log(match);
          console.log(match.awayTeam);
         rowsLive1.push( createData(match.awayTeam.name,match.homeTeam.name,"AW","HO",`${match.score.fullTime.awayTeam}-${match.score.fullTime.homeTeam}`));
        })
        setRows(rowsLive1);
      }
      
    ).catch(err=>console.log(err))
      const interval= setInterval(()=>{
    axios.get('http://api.football-data.org/v2/matches?status=LIVE',{headers :{
      'X-Auth-Token': '2bf2c7bfb63347f8a83a301df17f95d7'
    }}).then(
      res=> res.data).then(
        data=>{
         const rowsLive=[];
          data.matches.map(match=>{
            console.log(match);
            console.log(match.awayTeam);
           rowsLive.push( createData(match.awayTeam.name,match.homeTeam.name,"AW","HO",`${match.score.fullTime.awayTeam}-${match.score.fullTime.homeTeam}`));
          })
          console.log(rowsLive);
        }
    ).catch(err=>console.log(err))},30000)
    return () => clearInterval(interval);
  },[])

  // end Live matches ****

  // matches of the day 
  const [rowsDay,setRowsDay]=useState([]);
  useEffect(()=>{
    const date = new Date();
    console.log(date.getUTCDate());
    console.log(date.getMonth());
    
    axios.get(`http://api.football-data.org/v2/matches`,{headers :{
      'X-Auth-Token': '2bf2c7bfb63347f8a83a301df17f95d7'
    }}).then(res=>res.data).then(
      data=>{
        console.log(data);
       const rowsDays=[];
        data.matches.map(match=>{
          console.log(match);
          console.log(match.awayTeam);
         rowsDays.push( createData(match.awayTeam.name,match.homeTeam.name,"AW","HO",`${match.score.fullTime.awayTeam}-${match.score.fullTime.homeTeam}`));
        })
        setRowsDay(rowsDays);
      }
      
    ).catch(err=>console.log(err))
  },[])


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
      <Parallax small filter image={require("assets/img/profile-bg.jpg")}  />
      
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
           
            <GridContainer justify="center" className="hello">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper} >
                <NavPills
                  alignCenter
                  color="primary"
                  tabs={[
                    {
                      tabButton: "Football",
                      tabIcon: SportsSoccerIcon,
                      tabContent: (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12}>
                           <ScoreTab league="Live matches" rows={rowsLive}/>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                           <ScoreTab league="Today matches" rows={rowsDay}/>
                          </GridItem>
                          
                        </GridContainer>
                      )
                    },
                    {
                      tabButton: "Tennis",
                      tabIcon: SportsTennisIcon,
                      tabContent: (
                        <GridContainer justify="center">
                        
                        <GridItem xs={12} sm={12} md={12}>
                           <ScoreTab league="Open US" rows={rows}/>
                          </GridItem>
                          
                        </GridContainer>
                      )
                    },
                    {
                      tabButton: "Basketball",
                      tabIcon: SportsBasketballIcon,
                      tabContent: (
                        <GridContainer justify="center">
                             <GridItem xs={12} sm={12} md={12}>
                           <ScoreTab league="NBA" rows={rows}/>
                          </GridItem>
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
